"""Simple in-memory rate limiter for PoC deployments."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import HTTPException, Request


class RateLimiter:
    """In-memory rate limiter using sliding window."""

    def __init__(self):
        self.requests: Dict[str, List[datetime]] = defaultdict(list)

    def check_rate_limit(
        self,
        client_id: str,
        max_requests: int = 20,
        window_minutes: int = 60
    ) -> None:
        """
        Check if client has exceeded rate limit.

        Args:
            client_id: Unique identifier (usually IP address)
            max_requests: Maximum requests allowed in window
            window_minutes: Time window in minutes

        Raises:
            HTTPException: 429 if rate limit exceeded
        """
        now = datetime.now()
        cutoff = now - timedelta(minutes=window_minutes)

        # Clean old requests outside the window
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > cutoff
        ]

        # Check if limit exceeded
        if len(self.requests[client_id]) >= max_requests:
            retry_after = int((self.requests[client_id][0] - cutoff).total_seconds())
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window_minutes} minutes. Try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)}
            )

        # Record this request
        self.requests[client_id].append(now)

    def get_client_id(self, request: Request) -> str:
        """
        Extract client identifier from request.
        Uses X-Forwarded-For header if behind proxy, otherwise client IP.
        """
        # Check for proxy headers (used by Vercel, Railway, etc.)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Get first IP in chain (original client)
            return forwarded_for.split(",")[0].strip()

        # Fallback to direct client IP
        if request.client:
            return request.client.host

        # Last resort fallback
        return "unknown"


# Global rate limiter instance
_rate_limiter = RateLimiter()


def get_rate_limiter() -> RateLimiter:
    """Get the global rate limiter instance."""
    return _rate_limiter
