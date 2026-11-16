"""
ROYAL SCOUT — Root ASGI Application Entrypoint
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

This file exposes the FastAPI instance `app` at the repository root so that
standard cloud deployment commands like:
    uvicorn app:app --host 0.0.0.0 --port $PORT
work out of the box on Render, Railway, Fly.io, Heroku, AWS, and GCP without
requiring working-directory overrides.
"""

import os
import sys

# Ensure backend directory is in sys.path
_ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.join(_ROOT_DIR, "backend")

if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

# Import the validated FastAPI instance from backend/app.py
from backend.app import app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[ROYAL SCOUT] Launching root ASGI server on {host}:{port}...")
    uvicorn.run("app:app", host=host, port=port, reload=False)

