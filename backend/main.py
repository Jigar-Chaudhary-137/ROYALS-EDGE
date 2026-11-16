"""
ROYAL SCOUT — Backend Main Entrypoint Alias
Rajasthan Royals | SupeRR Selector Season 2 | IPL 2027 Auction Intelligence

Exposes `app` for deployment environments running from within `backend/`:
    uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import os
import sys

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

from app import app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

