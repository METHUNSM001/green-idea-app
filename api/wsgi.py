import os
import sys

# Ensure repo root is on path so we can import backend
ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.append(ROOT)

from asgiref.wsgi import WsgiToAsgi

try:
    # Import the Flask app from backend.app
    from backend.app import app as flask_app
except Exception:
    # Fallback: try importing backend as module if package style differs
    from backend import app as flask_app

# Expose ASGI app as `app` for Vercel's Python serverless runtime
app = WsgiToAsgi(flask_app)
