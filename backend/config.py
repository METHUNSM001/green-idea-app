"""Centralized configuration.

Every setting the app needs is read from the environment here, once, so:
  - a missing/misspelled variable fails immediately on startup with a
    clear message, instead of surfacing as a confusing error the first
    time some unrelated route runs.
  - nothing sensitive is hardcoded as a fallback value in source (the
    previous version of this app shipped a working admin password as a
    default argument to os.getenv, which meant it was sitting in git
    history in plain text).

Local dev: copy .env.example to .env and fill it in.
Render/production: set the same variable names in the dashboard instead.
"""
import os

from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            "Copy backend/.env.example to backend/.env (or set it in your "
            "host's dashboard) and fill it in."
        )
    return value


# --- Server ---
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").strip().lower() == "true"
PORT = int(os.getenv("PORT", "5000"))

# --- Database (Supabase Postgres) ---
DATABASE_URL = _require("DATABASE_URL")
DB_POOL_MAX = int(os.getenv("DB_POOL_MAX", "10"))

# --- Auth ---
JWT_SECRET = _require("JWT_SECRET")
ADMIN_EMAIL = _require("ADMIN_EMAIL")
ADMIN_PASSWORD = _require("ADMIN_PASSWORD")
ADMIN_EMAIL_ALIASES = {
    "smmethun2006@gmail.com",
    "smmethun2006@gmil.com",
    "tsmmethun2006@gmail.com",
    ADMIN_EMAIL.strip().lower(),
}

# --- Mail (used to send OTP emails) ---
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").strip().lower() == "true"
MAIL_USERNAME = _require("MAIL_USERNAME")
MAIL_PASSWORD = _require("MAIL_PASSWORD")

# --- Third-party APIs ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

# --- CORS ---
FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:19006"
    ).split(",")
    if origin.strip()
]


def error_detail(error: Exception):
    """Only echo real exception text back to clients outside production.

    Routes log the full error either way; this just controls what a
    caller of the API is allowed to see in the response body.
    """
    return str(error) if FLASK_DEBUG else "Please try again or contact support."
