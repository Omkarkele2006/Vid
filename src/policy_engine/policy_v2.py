from collections import defaultdict
from dataclasses import dataclass
from math import log1p
from typing import Dict, List

from src.policy_engine.events import ExecutionEvent


@dataclass
class SyscallStats:
    name: str
    executions: int
    total_new_edges: int
    average_new_edges: float
    max_new_edges: int
    error_rate: float
    score: float = 0.0
    priority: str = "low"


class AdaptivePolicyV2:

    def analyze(self, events: List[ExecutionEvent]) -> List[SyscallStats]:
        stats = defaultdict(
            lambda: {
                "executions": 0,
                "total_new_edges": 0,
                "max_new_edges": 0,
                "errors": 0,
            }
        )

        for event in events:
            for syscall in event.syscalls:
                s = stats[syscall.name]

                s["executions"] += 1
                s["total_new_edges"] += syscall.new_edges
                s["max_new_edges"] = max(
                    s["max_new_edges"],
                    syscall.new_edges
                )

                if syscall.errno != 0:
                    s["errors"] += 1

        if not stats:
            return []

        raw = []

        for name, s in stats.items():
            avg_edges = (
                s["total_new_edges"] / s["executions"]
            )

            error_rate = (
                s["errors"] / s["executions"]
            )

            raw.append(
                {
                    "name": name,
                    "executions": s["executions"],
                    "total_new_edges": s["total_new_edges"],
                    "average_new_edges": avg_edges,
                    "max_new_edges": s["max_new_edges"],
                    "error_rate": error_rate,
                }
            )

        max_avg = max(x["average_new_edges"] for x in raw) or 1.0
        max_total = max(x["total_new_edges"] for x in raw) or 1.0

        results = []

        for x in raw:
            avg_component = (
                log1p(x["average_new_edges"])
                / log1p(max_avg)
            )

            total_component = (
                log1p(x["total_new_edges"])
                / log1p(max_total)
            )

            reliability_component = 1.0 - x["error_rate"]

            score = (
                0.60 * avg_component
                + 0.25 * total_component
                + 0.15 * reliability_component
            )

            x["score"] = round(score, 4)
            results.append(x)

        scores = sorted(x["score"] for x in results)

        def percentile(p: float) -> float:
            index = int((len(scores) - 1) * p)
            return scores[index]

        high_threshold = percentile(0.75)
        medium_threshold = percentile(0.40)

        final = []

        for x in results:
            if x["score"] >= high_threshold:
                priority = "high"
            elif x["score"] >= medium_threshold:
                priority = "medium"
            else:
                priority = "low"

            final.append(
                SyscallStats(
                    name=x["name"],
                    executions=x["executions"],
                    total_new_edges=x["total_new_edges"],
                    average_new_edges=round(
                        x["average_new_edges"], 3
                    ),
                    max_new_edges=x["max_new_edges"],
                    error_rate=round(
                        x["error_rate"], 4
                    ),
                    score=x["score"],
                    priority=priority,
                )
            )

        return sorted(
            final,
            key=lambda x: x.score,
            reverse=True,
        )