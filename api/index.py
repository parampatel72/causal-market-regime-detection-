import sys
import os

# Add the project root to the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.main import app as fast_app

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
