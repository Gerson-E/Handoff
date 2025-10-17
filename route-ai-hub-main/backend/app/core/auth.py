from __future__ import annotations

from fastapi import Header, HTTPException, status, Request
from .config import get_settings


async def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    settings = get_settings()
    if settings.api_key and x_api_key != settings.api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


class APIKeyMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        headers = dict(scope.get("headers") or [])
        # headers are lowercased bytes
        provided = headers.get(b"x-api-key", b"").decode()
        settings = get_settings()
        if settings.api_key and provided != settings.api_key:
            res = {
                "type": "http.response.start",
                "status": 401,
                "headers": [(b"content-type", b"application/json")],
            }
            await send(res)
            body = {"detail": "Invalid API key"}
            await send({"type": "http.response.body", "body": bytes(str(body), "utf-8")})
            return
        return await self.app(scope, receive, send)


