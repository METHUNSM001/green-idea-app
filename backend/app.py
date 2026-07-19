import os
import json
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail
from functools import wraps
import jwt
import bcrypt
import mysql.connector

from dotenv import load_dotenv

import auth_routes
from database import get_db_connection


load_dotenv()


app = Flask(__name__)


CORS(app)


# =========================================
# EMAIL CONFIGURATION
# =========================================

app.config["MAIL_SERVER"] = "smtp.gmail.com"

app.config["MAIL_PORT"] = 587

app.config["MAIL_USE_TLS"] = True

app.config["MAIL_USERNAME"] = os.getenv(
    "MAIL_USERNAME"
)

app.config["MAIL_PASSWORD"] = os.getenv(
    "MAIL_PASSWORD"
)


mail = Mail(app)


auth_routes.mail = mail


ADMIN_EMAIL_ALIASES = [
    "smmethun2006@gmail.com",
    "smmethun2006@gmil.com",
    "tsmmethun2006@gmail.com",
]
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "smmethun2006@gmail.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "metvis1311200613022008")


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Admin access required"}), 401

        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        except Exception:
            return jsonify({"message": "Invalid or expired token"}), 401

        payload_email = (payload.get("email") or "").strip().lower()
        is_admin_payload = bool(payload.get("is_admin")) or payload_email in {alias.lower() for alias in ADMIN_EMAIL_ALIASES}
        if not is_admin_payload:
            return jsonify({"message": "Admin access required"}), 403

        return f(*args, **kwargs)

    return decorated


# =========================================
# REGISTER AUTH ROUTES
# =========================================

app.register_blueprint(
    auth_routes.auth_bp
)


# =========================================
# HOME ROUTE
# =========================================

@app.route("/")
def home():

    return {

        "message":
        "Green Idea Backend is Running"

    }


# =========================================
# AGRICULTURE RECOMMENDATION
# =========================================

@app.route("/api/agriculture/recommend", methods=["POST"])
def agriculture_recommend():
    try:
        data = request.get_json()
        district = (data.get("district") or "Coimbatore").strip()
        weather_response = requests.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                "q": district,
                "appid": os.getenv("OPENWEATHER_API_KEY"),
                "units": "metric",
            },
            timeout=10,
        )

        weather_payload = weather_response.json() if weather_response.ok else {}
        forecast_summary = []
        if weather_payload.get("list"):
            for item in weather_payload["list"][:8]:
                forecast_summary.append({
                    "time": item.get("dt_txt"),
                    "temp": item.get("main", {}).get("temp"),
                    "description": item.get("weather", [{}])[0].get("description", ""),
                    "rain_prob": int((item.get("pop") or 0) * 100),
                })

        prompt = f"""
You are Green Idea AI farming advisor.
Recommend a crop and farming plan for a farmer with these details:
- last sown crop: {data.get('last_sown_crop') or 'unknown'}
- soil type: {data.get('soil_type') or 'unknown'}
- soil pH: {data.get('soil_ph') or 'unknown'}
- soil minerals: {data.get('soil_minerals') or 'unknown'}
- water availability: {data.get('water_availability') or 'unknown'}
- watering days per week: {data.get('watering_days') or 'unknown'}
- watering hours per day: {data.get('watering_hours') or 'unknown'}
- land size: {data.get('land_size') or 'unknown'} {data.get('land_unit') or 'acres'}
- budget: {data.get('budget') or 'unknown'}
- district: {district}
- season: {data.get('season') or 'unknown'}
- preferred language: {data.get('preferred_language') or 'English'}
- short weather summary: {forecast_summary[:3]}
Return valid JSON with keys: recommended_crop, sowing_time, harvest_duration, maintenance_plan, watering_plan, reasoning.
"""

        groq_response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are a concise agricultural assistant."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.4,
            },
            timeout=30,
        )

        if not groq_response.ok:
            return jsonify({"message": "AI recommendation service unavailable", "error": groq_response.text}), 502

        content = groq_response.json()["choices"][0]["message"]["content"]

        try:
            parsed = json.loads(content)
            return jsonify(parsed)
        except Exception:
            return jsonify({
                "recommended_crop": "Millet",
                "sowing_time": "Next suitable planting window",
                "harvest_duration": "90-120 days",
                "maintenance_plan": content,
                "watering_plan": "Water early morning and check soil moisture regularly.",
                "reasoning": "The AI advisor returned a plain-text response; please review the recommendation carefully.",
            })

    except Exception as error:
        print("AGRICULTURE RECOMMEND ERROR:", error)
        return jsonify({"message": "Recommendation failed", "error": str(error)}), 500


# =========================================
# WEATHER FORECAST
# =========================================

@app.route("/api/agriculture/weather", methods=["POST"])
def agriculture_weather():
    try:
        data = request.get_json() or {}
        location = (data.get("location") or "Coimbatore").strip()
        weather_response = requests.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                "q": location,
                "appid": os.getenv("OPENWEATHER_API_KEY"),
                "units": "metric",
            },
            timeout=10,
        )

        if not weather_response.ok:
            return jsonify({"message": "Weather service unavailable", "error": weather_response.text}), 502

        payload = weather_response.json()
        daily = []

        for item in payload.get("list", [])[:8]:
            daily.append({
                "time": item.get("dt_txt"),
                "temp": item.get("main", {}).get("temp"),
                "temp_min": item.get("main", {}).get("temp_min"),
                "temp_max": item.get("main", {}).get("temp_max"),
                "description": item.get("weather", [{}])[0].get("description", ""),
                "humidity": item.get("main", {}).get("humidity"),
                "wind": item.get("wind", {}).get("speed"),
                "rain_prob": int((item.get("pop") or 0) * 100),
            })

        alerts = []
        for entry in daily:
            if entry["rain_prob"] >= 70:
                alerts.append(f"Heavy rain likely: {entry['description']} with {entry['rain_prob']}% rain chance")
            elif entry["rain_prob"] >= 50:
                alerts.append(f"Rain expected: {entry['description']} with {entry['rain_prob']}% rain chance")

        return jsonify({
            "city": payload.get("city", {}).get("name", location),
            "forecast": daily,
            "alerts": alerts,
            "summary": daily[0] if daily else None,
        })

    except Exception as error:
        print("AGRICULTURE WEATHER ERROR:", error)
        return jsonify({"message": "Weather fetch failed", "error": str(error)}), 500


# =========================================
# TRANSPORT PROVIDERS
# =========================================

@app.route("/api/transporters", methods=["GET"])
def list_transporters():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM transporters WHERE available = TRUE"
        filters = []
        params = []

        district = request.args.get("district", "").strip()
        city = request.args.get("city", "").strip()
        service_type = request.args.get("service_type", "").strip()
        vehicle_type = request.args.get("vehicle_type", "").strip()

        if district:
            filters.append("district = %s")
            params.append(district)
        if city:
            filters.append("city = %s")
            params.append(city)
        if service_type:
            filters.append("service_type = %s")
            params.append(service_type)
        if vehicle_type:
            filters.append("vehicle_type = %s")
            params.append(vehicle_type)

        if filters:
            query += " AND " + " AND ".join(filters)

        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        transporters = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(transporters)
    except Exception as error:
        print("TRANSPORTERS LIST ERROR:", error)
        return jsonify({"message": "Unable to load transporters", "error": str(error)}), 500


@app.route("/api/transporters", methods=["POST"])
def add_transporter():
    try:
        data = request.get_json() or {}
        required_fields = ["name", "phone", "service_type", "vehicle_type", "district", "city", "location"]
        missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
        if missing:
            return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO transporters
            (name, phone, service_type, vehicle_type, district, city, location, available)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data["name"].strip(),
                data["phone"].strip(),
                data["service_type"].strip(),
                data["vehicle_type"].strip(),
                data["district"].strip(),
                data["city"].strip(),
                data["location"].strip(),
                bool(data.get("available", True)),
            ),
        )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Transporter added successfully"}), 201
    except Exception as error:
        print("ADD TRANSPORTER ERROR:", error)
        return jsonify({"message": "Unable to add transporter", "error": str(error)}), 500


# =========================================
# FARMING SERVICES
# =========================================


def ensure_farming_service_table(table_name):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        f"""
        CREATE TABLE IF NOT EXISTS `{table_name}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            service_name VARCHAR(150) NOT NULL,
            district VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            price VARCHAR(50) DEFAULT '',
            notes TEXT DEFAULT '',
            image_url VARCHAR(500) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.commit()
    cursor.close()
    connection.close()


@app.route("/api/farming-services/<service_key>", methods=["GET"])
def list_farming_services(service_key):
    allowed_services = {"equipment", "irrigation", "iot", "pest_control"}
    if service_key not in allowed_services:
        return jsonify({"message": "Unsupported service"}), 404

    table_name = f"{service_key}_services"
    ensure_farming_service_table(table_name)

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = f"SELECT * FROM `{table_name}`"
        filters = []
        params = []

        city = request.args.get("city", "").strip()
        district = request.args.get("district", "").strip()
        if city:
            filters.append("city LIKE %s")
            params.append(f"%{city}%")
        if district:
            filters.append("district LIKE %s")
            params.append(f"%{district}%")

        if filters:
            query += " WHERE " + " AND ".join(filters)

        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        records = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(records)
    except Exception as error:
        print("FARMING SERVICES LIST ERROR:", error)
        return jsonify({"message": "Unable to load services", "error": str(error)}), 500


@app.route("/api/farming-services/<service_key>", methods=["POST"])
def add_farming_service(service_key):
    allowed_services = {"equipment", "irrigation", "iot", "pest_control"}
    if service_key not in allowed_services:
        return jsonify({"message": "Unsupported service"}), 404

    table_name = f"{service_key}_services"
    ensure_farming_service_table(table_name)

    try:
        data = request.get_json() or {}
        required_fields = ["name", "phone", "service_name", "district", "city"]
        missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
        if missing:
            return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            f"""
            INSERT INTO `{table_name}`
            (name, phone, service_name, district, city, price, notes, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                str(data.get("name", "")).strip(),
                str(data.get("phone", "")).strip(),
                str(data.get("service_name", "")).strip(),
                str(data.get("district", "")).strip(),
                str(data.get("city", "")).strip(),
                str(data.get("price", "")).strip(),
                str(data.get("notes", "")).strip(),
                str(data.get("image_url", "")).strip(),
            ),
        )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Service registered successfully"}), 201
    except Exception as error:
        print("ADD FARMING SERVICE ERROR:", error)
        return jsonify({"message": "Unable to register service", "error": str(error)}), 500


# =========================================
# WORKERS
# =========================================

@app.route("/api/workers", methods=["GET"])
def list_workers():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM workers"
        filters = []
        params = []

        panchayat = request.args.get("panchayat", "").strip()
        if panchayat:
            filters.append("panchayat LIKE %s")
            params.append(f"%{panchayat}%")

        if filters:
            query += " WHERE " + " AND ".join(filters)

        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        workers = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(workers)
    except Exception as error:
        print("WORKERS LIST ERROR:", error)
        return jsonify({"message": "Unable to load workers", "error": str(error)}), 500


@app.route("/api/workers", methods=["POST"])
def add_worker():
    try:
        data = request.get_json() or {}
        required_fields = ["name", "age", "city", "district", "panchayat", "phone"]
        missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
        if missing:
            return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO workers
            (name, age, city, district, panchayat, phone)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                str(data["name"]).strip(),
                str(data["age"]).strip(),
                str(data["city"]).strip(),
                str(data["district"]).strip(),
                str(data["panchayat"]).strip(),
                str(data["phone"]).strip(),
            ),
        )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Worker registered successfully"}), 201
    except Exception as error:
        print("ADD WORKER ERROR:", error)
        return jsonify({"message": "Unable to register worker", "error": str(error)}), 500


# =========================================
# EQUIPMENT SERVICES
# =========================================

def ensure_equipment_table():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS equipment_services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            equipment_name VARCHAR(150) NOT NULL,
            equipment_type VARCHAR(100) NOT NULL,
            district VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            price VARCHAR(50) DEFAULT '',
            image_url VARCHAR(500) DEFAULT '',
            available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.commit()
    cursor.close()
    connection.close()


@app.route("/api/services/equipment", methods=["GET"])
def list_equipment():
    ensure_equipment_table()
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM equipment_services WHERE available = TRUE"
        filters = []
        params = []

        city = request.args.get("city", "").strip()
        district = request.args.get("district", "").strip()

        if city:
            filters.append("city LIKE %s")
            params.append(f"%{city}%")
        if district:
            filters.append("district LIKE %s")
            params.append(f"%{district}%")

        if filters:
            query += " AND " + " AND ".join(filters)

        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        equipment = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(equipment)
    except Exception as error:
        print("EQUIPMENT LIST ERROR:", error)
        return jsonify({"message": "Unable to load equipment", "error": str(error)}), 500


@app.route("/api/services/equipment", methods=["POST"])
def add_equipment():
    ensure_equipment_table()
    try:
        data = request.get_json() or {}
        required_fields = ["name", "phone", "equipment_name", "equipment_type", "district", "city"]
        missing = [field for field in required_fields if not str(data.get(field, "")).strip()]
        if missing:
            return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO equipment_services
            (name, phone, equipment_name, equipment_type, district, city, price, image_url, available)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                str(data.get("name", "")).strip(),
                str(data.get("phone", "")).strip(),
                str(data.get("equipment_name", "")).strip(),
                str(data.get("equipment_type", "")).strip(),
                str(data.get("district", "")).strip(),
                str(data.get("city", "")).strip(),
                str(data.get("price", "")).strip(),
                str(data.get("image_url", "")).strip(),
                bool(data.get("available", True)),
            ),
        )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Equipment registered successfully"}), 201
    except Exception as error:
        print("ADD EQUIPMENT ERROR:", error)
        return jsonify({"message": "Unable to register equipment", "error": str(error)}), 500


# =========================================
# AI FARMING ASSISTANT CHAT
# =========================================

@app.route("/api/agriculture/chat", methods=["POST"])
def agriculture_chat():
    try:
        data = request.get_json() or {}
        message = (data.get("message") or "").strip()
        language = data.get("language") or "English"

        if not message:
            return jsonify({"message": "Please enter a question"}), 400

        groq_response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are Green Idea AI farming assistant. Respond in {language}. Give short practical advice for farmers. Include irrigation, fertilizer, pest, crop disease, and weather tips when relevant.",
                    },
                    {"role": "user", "content": message},
                ],
                "temperature": 0.4,
            },
            timeout=30,
        )

        if not groq_response.ok:
            return jsonify({"message": "Assistant service unavailable", "error": groq_response.text}), 502

        reply = groq_response.json()["choices"][0]["message"]["content"]
        return jsonify({"reply": reply})

    except Exception as error:
        print("AGRICULTURE CHAT ERROR:", error)
        return jsonify({"message": "Assistant failed", "error": str(error)}), 500


# =========================================
# RUN SERVER
# =========================================

if __name__ == "__main__":

    app.run(

        debug=True,

        port=5000

    )