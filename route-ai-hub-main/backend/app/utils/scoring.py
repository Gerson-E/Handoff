from __future__ import annotations

from typing import Dict, Iterable


def score_features(features: Dict[str, float]) -> float:
    return float(sum(features.values()))


def normalize(values: Iterable[float]) -> list[float]:
    vals = list(values)
    if not vals:
        return []
    min_v = min(vals)
    max_v = max(vals)
    rng = max_v - min_v
    if rng == 0:
        return [0.0 for _ in vals]
    return [(v - min_v) / rng for v in vals]


