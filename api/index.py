import sys
import os

# Add the project root to the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.regime_tester import router as regime_router

# Create a minimal app exclusively for Vercel Serverless
fast_app = FastAPI(title="Regime Tester API (Vercel)")

fast_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the router. The middleware below strips '/api' so /api/regime/live becomes /regime/live
fast_app.include_router(regime_router)

class VercelPathMiddleware:
    """Middleware to strip /api prefix from request path for Vercel deployment."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" or scope["type"] == "websocket":
            path = scope.get("path", "")
            if path.startswith("/api"):
                scope["path"] = path[4:] or "/"
        await self.app(scope, receive, send)

app = VercelPathMiddleware(fast_app)
