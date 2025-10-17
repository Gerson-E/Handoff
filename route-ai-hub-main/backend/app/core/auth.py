from __future__ import annotations

from fastapi import Header, HTTPException, status, Request
import json
from hmac import compare_digest
from .config import get_settings

PUBLIC_PATHS = {
    "/health",
    "/metrics",
    "/openapi.json",
    "/docs",
    "/docs/index.html",
    "/events/stream",
}

API_KEY_ENV = "API_KEY"

async def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    settings = get_settings()
    if settings.api_key and x_api_key != settings.api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


class APIKeyMiddleware:
    def __init__(self, app):
        self.app = app
        self.public_paths = {
            "/health",
            "/metrics",
            "/openapi.json",
            "/docs",
            "/docs/index.html",
            "/events/stream",
        }

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        path = scope.get("path") or ""
        if path in self.public_paths:
            return await self.app(scope, receive, send)
        headers = dict(scope.get("headers") or [])
        # headers are lowercased bytes
        provided = (headers.get(b"x-api-key", b"").decode() or "").strip()
        settings = get_settings()
        configured = (settings.api_key or "").strip()
        if configured and not compare_digest(provided, configured):
            payload = json.dumps({"detail": "Invalid API key"}).encode("utf-8")
            headers_list = [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(payload)).encode("ascii")),
            ]
            await send({
                "type": "http.response.start",
                "status": 401,
                "headers": headers_list,
            })
            await send({"type": "http.response.body", "body": payload})
            return
        return await self.app(scope, receive, send)


