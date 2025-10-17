from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import List, Dict


@dataclass
class _Counters:
    routed: int = 0
    fallback: int = 0
    failed: int = 0
    sse_clients: int = 0
    total_confidence: float = 0.0
    decisions: int = 0


class _LatencyStats:
    def __init__(self) -> None:
        self.ewma_ms: float = 0.0
        self.alpha: float = 0.2  # smoothing factor
        self.samples: List[float] = []
        self.max_samples: int = 256

    def record(self, duration_ms: float) -> None:
        if self.ewma_ms == 0.0:
            self.ewma_ms = duration_ms
        else:
            self.ewma_ms = self.alpha * duration_ms + (1 - self.alpha) * self.ewma_ms
        self.samples.append(duration_ms)
        if len(self.samples) > self.max_samples:
            self.samples.pop(0)

    def percentiles(self) -> Dict[str, float]:
        if not self.samples:
            return {"p50": 0.0, "p95": 0.0}
        s = sorted(self.samples)
        def pct(p: float) -> float:
            if not s:
                return 0.0
            k = max(0, min(len(s) - 1, int(round((p / 100.0) * (len(s) - 1)))))
            return float(s[k])
        return {"p50": pct(50.0), "p95": pct(95.0)}


class Metrics:
    def __init__(self) -> None:
        self.c = _Counters()
        self.latency = _LatencyStats()

    def record_request(self, duration_ms: float) -> None:
        self.latency.record(duration_ms)

    def record_decision(self, status: str, confidence: float) -> None:
        if status == "routed":
            self.c.routed += 1
        elif status == "fallback":
            self.c.fallback += 1
        else:
            self.c.failed += 1
        self.c.total_confidence += float(confidence or 0.0)
        self.c.decisions += 1

    def inc_sse(self) -> None:
        self.c.sse_clients += 1

    def dec_sse(self) -> None:
        if self.c.sse_clients > 0:
            self.c.sse_clients -= 1

    def snapshot(self) -> Dict[str, float | int]:
        pct = self.latency.percentiles()
        avg_conf = (self.c.total_confidence / self.c.decisions) if self.c.decisions else 0.0
        return {
            "routed": self.c.routed,
            "fallback": self.c.fallback,
            "failed": self.c.failed,
            "avg_confidence": round(avg_conf, 4),
            "ewma_ms": round(self.latency.ewma_ms, 2),
            "p50_ms": round(pct["p50"], 2),
            "p95_ms": round(pct["p95"], 2),
            "sse_clients": self.c.sse_clients,
        }


_metrics = Metrics()


def get_metrics() -> Metrics:
    return _metrics


class RequestTimingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        start = time.time()
        async def send_wrapper(message):
            if message.get("type") == "http.response.start":
                duration_ms = (time.time() - start) * 1000.0
                get_metrics().record_request(duration_ms)
            return await send(message)
        return await self.app(scope, receive, send_wrapper)


