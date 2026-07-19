from flask import Blueprint, request, jsonify
from database import get_db_connection

import bcrypt
import jwt
import os
import random
import datetime

from dotenv import load_dotenv
from flask_mail import Message

load_dotenv()

ADMIN_EMAIL_ALIASES = [
    "smmethun2006@gmail.com",
    "smmethun2006@gmil.com",
    "tsmmethun2006@gmail.com",
]
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "smmethun2006@gmail.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "metvis1311200613022008")

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# Flask-Mail object
mail = None


# =========================================
# REGISTER
# =========================================

@auth_bp.route("/register", methods=["POST"])
def register():

    try:

        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:

            return jsonify({
                "message": "All fields are required"
            }), 400

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email = %s OR username = %s
            """,
            (email, username)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            cursor.close()
            connection.close()

            return jsonify({
                "message": "Email or username already exists"
            }), 409

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        cursor.execute(
            """
            INSERT INTO users
            (username, email, password_hash)
            VALUES (%s, %s, %s)
            """,
            (
                username,
                email,
                hashed_password.decode("utf-8")
            )
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except Exception as error:

        print("REGISTER ERROR:", error)

        return jsonify({
            "message": "Registration failed",
            "error": str(error)
        }), 500


# =========================================
# LOGIN
# =========================================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "message": "Email and password are required"
            }), 400

        normalized_email = (email or "").strip().lower()
        is_admin_login = normalized_email in {alias.lower() for alias in ADMIN_EMAIL_ALIASES} and password == ADMIN_PASSWORD
        if is_admin_login:
            token = jwt.encode(
                {
                    "user_id": 0,
                    "username": "Admin",
                    "email": ADMIN_EMAIL,
                    "is_admin": True,
                    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
                },
                os.getenv("JWT_SECRET"),
                algorithm="HS256"
            )
            return jsonify({
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": 0,
                    "username": "Admin",
                    "email": ADMIN_EMAIL,
                    "is_admin": True,
                }
            }), 200

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if not user:

            return jsonify({
                "message": "Invalid email or password"
            }), 401

        password_correct = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password_hash"].encode("utf-8")
        )

        if not password_correct:

            return jsonify({
                "message": "Invalid email or password"
            }), 401

        token = jwt.encode(
            {
                "user_id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "exp": datetime.datetime.now(
                    datetime.timezone.utc
                ) + datetime.timedelta(days=7)
            },
            os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )

        return jsonify({

            "message": "Login successful",

            "token": token,

            "user": {

                "id": user["id"],

                "username": user["username"],

                "email": user["email"],
                "is_admin": False

            }

        }), 200

    except Exception as error:

        print("LOGIN ERROR:", error)

        return jsonify({

            "message": "Login failed",

            "error": str(error)

        }), 500


# =========================================
# FORGOT PASSWORD
# =========================================

@auth_bp.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    try:

        data = request.get_json()

        email = data.get("email")

        if not email:

            return jsonify({

                "message": "Email is required"

            }), 400

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(

            """
            SELECT *
            FROM users
            WHERE email = %s
            """,

            (email,)

        )

        user = cursor.fetchone()

        if not user:

            cursor.close()

            connection.close()

            return jsonify({

                "message":
                "If this email exists, an OTP will be sent"

            }), 200

        otp = str(

            random.randint(
                100000,
                999999
            )

        )

        expires_at = (

            datetime.datetime.now()
            + datetime.timedelta(
                minutes=10
            )

        )

        cursor.execute(

            """
            INSERT INTO password_reset_otps
            (email, otp, expires_at)
            VALUES (%s, %s, %s)
            """,

            (
                email,
                otp,
                expires_at
            )

        )

        connection.commit()

        cursor.close()

        connection.close()

        message = Message(

            subject="Green Idea Password Reset OTP",

            sender=os.getenv(
                "MAIL_USERNAME"
            ),

            recipients=[email]

        )

        message.body = f"""

Hello {user['username']},

Your Green Idea password reset OTP is:

{otp}

This OTP will expire in 10 minutes.

If you did not request this password reset,
please ignore this email.

Green Idea Team

"""

        mail.send(message)

        return jsonify({

            "message":
            "OTP sent successfully"

        }), 200

    except Exception as error:

        print(
            "FORGOT PASSWORD ERROR:",
            error
        )

        return jsonify({

            "message":
            "Unable to send OTP",

            "error":
            str(error)

        }), 500


# =========================================
# VERIFY OTP
# =========================================

@auth_bp.route(
    "/verify-otp",
    methods=["POST"]
)
def verify_otp():

    try:

        data = request.get_json()

        email = data.get("email")

        otp = data.get("otp")

        if not email or not otp:

            return jsonify({

                "message":
                "Email and OTP are required"

            }), 400

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(

            """
            SELECT *
            FROM password_reset_otps
            WHERE email = %s
            AND otp = %s
            AND is_used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
            """,

            (
                email,
                otp
            )

        )

        otp_record = cursor.fetchone()

        cursor.close()

        connection.close()

        if not otp_record:

            return jsonify({

                "message":
                "Invalid OTP"

            }), 400

        if datetime.datetime.now() > otp_record[
            "expires_at"
        ]:

            return jsonify({

                "message":
                "OTP has expired"

            }), 400

        return jsonify({

            "message":
            "OTP verified successfully"

        }), 200

    except Exception as error:

        print(
            "VERIFY OTP ERROR:",
            error
        )

        return jsonify({

            "message":
            "OTP verification failed",

            "error":
            str(error)

        }), 500


# =========================================
# RESET PASSWORD
# =========================================

@auth_bp.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    try:

        data = request.get_json()

        email = data.get("email")

        otp = data.get("otp")

        new_password = data.get(
            "new_password"
        )

        if not email or not otp or not new_password:

            return jsonify({

                "message":
                "All fields are required"

            }), 400

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(

            """
            SELECT *
            FROM password_reset_otps
            WHERE email = %s
            AND otp = %s
            AND is_used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
            """,

            (
                email,
                otp
            )

        )

        otp_record = cursor.fetchone()

        if not otp_record:

            cursor.close()

            connection.close()

            return jsonify({

                "message":
                "Invalid OTP"

            }), 400

        if datetime.datetime.now() > otp_record[
            "expires_at"
        ]:

            cursor.close()

            connection.close()

            return jsonify({

                "message":
                "OTP has expired"

            }), 400

        hashed_password = bcrypt.hashpw(

            new_password.encode(
                "utf-8"
            ),

            bcrypt.gensalt()

        )

        cursor.execute(

            """
            UPDATE users
            SET password_hash = %s
            WHERE email = %s
            """,

            (

                hashed_password.decode(
                    "utf-8"
                ),

                email

            )

        )

        cursor.execute(

            """
            UPDATE password_reset_otps
            SET is_used = TRUE
            WHERE id = %s
            """,

            (

                otp_record["id"],

            )

        )

        connection.commit()

        cursor.close()

        connection.close()

        return jsonify({

            "message":
            "Password reset successfully"

        }), 200

    except Exception as error:

        print(

            "RESET PASSWORD ERROR:",

            error

        )

        return jsonify({

            "message":
            "Password reset failed",

            "error":
            str(error)

        }), 500