import json
from pathlib import Path
from typing import List

from src.policy_engine.events import ExecutionEvent, SyscallEvent


def load_execution_events(path: str | Path) -> List[ExecutionEvent]:
    events: List[ExecutionEvent] = []

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if not line:
                continue

            raw = json.loads(line)

            syscalls = [
                SyscallEvent(
                    name=sc["name"],
                    new_edges=int(sc.get("newEdges", 0)),
                    errno=int(sc.get("errno", 0)),
                    flags=int(sc.get("flags", 0)),
                )
                for sc in raw.get("syscalls", [])
            ]

            # Syzkaller executionTime is in nanoseconds.
            execution_time_ns = float(
                raw.get("executionTime", 0)
            )

            events.append(
                ExecutionEvent(
                    exec_id=str(raw["exec_id"]),
                    timestamp=raw["timestamp"],
                    syscalls=syscalls,
                    total_new_coverage=int(
                        raw.get("totalNewCoverage", 0)
                    ),
                    exec_time_ms=execution_time_ns / 1_000_000.0,
                    crashed=bool(
                        raw.get("crashed", False)
                    ),
                )
            )

    return events