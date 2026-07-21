import datetime
import hmac
import random

import bcrypt
import jwt
from flask import Blueprint, jsonify, request
from flask_mail import Message

import config
from database import get_db_cursor

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Set by app.py after the Mail instance is created, so this module never
# has to build its own Flask app/mail context.
mail = None


def _issue_token(user_id, username, email, is_admin=False):
    payload = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
    }
    if is_admin:
        payload["is_admin"] = True
    return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")


# =========================================
# REGISTER
# =========================================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json() or {}
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not username or not email or not password:
            return jsonify({"message": "All fields are required"}), 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s OR username = %s",
                (email, username),
            )
            if cursor.fetchone():
                return jsonify({"message": "Email or username already exists"}), 409

            password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
            cursor.execute(
                """
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
                """,
                (username, email, password_hash.decode("utf-8")),
            )

        return jsonify({"message": "Registration successful"}), 201

    except Exception as error:
        print("REGISTER ERROR:", error)
        return jsonify({"message": "Registration failed", "error": config.error_detail(error)}), 500


# =========================================
# LOGIN
# =========================================
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        normalized_email = email.lower()
        is_admin_login = normalized_email in config.ADMIN_EMAIL_ALIASES and hmac.compare_digest(
            password, config.ADMIN_PASSWORD
        )
        if is_admin_login:
            token = _issue_token(0, "Admin", config.ADMIN_EMAIL, is_admin=True)
            return jsonify(
                {
                    "message": "Login successful",
                    "token": token,
                    "user": {"id": 0, "username": "Admin", "email": config.ADMIN_EMAIL, "is_admin": True},
                }
            ), 200

        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

        if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
            return jsonify({"message": "Invalid email or password"}), 401

        token = _issue_token(user["id"], user["username"], user["email"])
        return jsonify(
            {
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"],
                    "is_admin": False,
                },
            }
        ), 200

    except Exception as error:
        print("LOGIN ERROR:", error)
        return jsonify({"message": "Login failed", "error": config.error_detail(error)}), 500


# =========================================
# FORGOT PASSWORD
# =========================================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip()
        if not email:
            return jsonify({"message": "Email is required"}), 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            # Same response whether or not the email exists, so this
            # endpoint can't be used to find out who has an account.
            if not user:
                return jsonify({"message": "If this email exists, an OTP will be sent"}), 200

            otp = str(random.randint(100000, 999999))
            expires_at = datetime.datetime.now() + datetime.timedelta(minutes=10)

            cursor.execute(
                "INSERT INTO password_reset_otps (email, otp, expires_at) VALUES (%s, %s, %s)",
                (email, otp, expires_at),
            )

        message = Message(
            subject="Green Idea Password Reset OTP",
            sender=config.MAIL_USERNAME,
            recipients=[email],
        )
        message.body = (
            f"Hello {user['username']},\n\n"
            f"Your Green Idea password reset OTP is: {otp}\n\n"
            "This OTP will expire in 10 minutes.\n"
            "If you did not request this password reset, please ignore this email.\n\n"
            "Green Idea Team"
        )
        mail.send(message)

        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as error:
        print("FORGOT PASSWORD ERROR:", error)
        return jsonify({"message": "Unable to send OTP", "error": config.error_detail(error)}), 500


# =========================================
# VERIFY OTP
# =========================================
@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip()
        otp = (data.get("otp") or "").strip()
        if not email or not otp:
            return jsonify({"message": "Email and OTP are required"}), 400

        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM password_reset_otps
                WHERE email = %s AND otp = %s AND is_used = FALSE
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (email, otp),
            )
            otp_record = cursor.fetchone()

        if not otp_record:
            return jsonify({"message": "Invalid OTP"}), 400

        if datetime.datetime.now() > otp_record["expires_at"]:
            return jsonify({"message": "OTP has expired"}), 400

        return jsonify({"message": "OTP verified successfully"}), 200

    except Exception as error:
        print("VERIFY OTP ERROR:", error)
        return jsonify({"message": "OTP verification failed", "error": config.error_detail(error)}), 500


# =========================================
# RESET PASSWORD
# =========================================
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip()
        otp = (data.get("otp") or "").strip()
        new_password = data.get("new_password") or ""

        if not email or not otp or not new_password:
            return jsonify({"message": "All fields are required"}), 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                """
                SELECT * FROM password_reset_otps
                WHERE email = %s AND otp = %s AND is_used = FALSE
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (email, otp),
            )
            otp_record = cursor.fetchone()

            if not otp_record:
                return jsonify({"message": "Invalid OTP"}), 400

            if datetime.datetime.now() > otp_record["expires_at"]:
                return jsonify({"message": "OTP has expired"}), 400

            password_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
            cursor.execute(
                "UPDATE users SET password_hash = %s WHERE email = %s",
                (password_hash.decode("utf-8"), email),
            )
            cursor.execute(
                "UPDATE password_reset_otps SET is_used = TRUE WHERE id = %s",
                (otp_record["id"],),
            )

        return jsonify({"message": "Password reset successfully"}), 200

    except Exception as error:
        print("RESET PASSWORD ERROR:", error)
        return jsonify({"message": "Password reset failed", "error": config.error_detail(error)}), 500
