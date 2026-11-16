"""
ROYAL SCOUT — Root ASGI Alias Entrypoint
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

Provides `app` for deployment environments configured with:
    uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import os
import sys

_ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.join(_ROOT_DIR, "backend")

if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from backend.app import app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[ROYAL SCOUT] Launching main ASGI server on {host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=False)

