#!/usr/bin/env python3
"""
Vid — Feature Extraction Engine (executions) — v2

Improvements over v1:
  - Real, interpolated timestamps per execution (v1 used one fake constant
    timestamp for every record). We anchor using syz-manager's periodic
    stats lines, which carry real wallclock time. Each execution's
    timestamp is proportionally interpolated across the run's real time
    range based on its order in the log.
  - workerID is now derived from the "proc N:" prefix in the log, instead
    of always being 0.

Still-known placeholders (not present in -debug text log at all):
  cpuUsage, memUsageMB, coverage, newEdges  -> require Syzkaller's RPC/JSON
  execution mode to get real per-exec values; left as 0 here, documented.

Usage:
    python3 extract_executions.py <debug.log> <output.json>
"""

import sys
import os
import re
import json
from datetime import datetime, timezone

REQUEST_START_RE = re.compile(r"proc (\d+): (?:start executing request|recv exec request)\s+(\d+)")
SYSCALL_LINE_RE = re.compile(r"#(\d+)\s+\[(\d+)ms\]\s+(->|<-)\s+(\w+)")
STATS_LINE_RE = re.compile(
    r"^(?P<date>\d{4}/\d{2}/\d{2})\s+(?P<time>\d{2}:\d{2}:\d{2})\s+"
    r"candidates=\d+\s+corpus=\d+\s+coverage=\d+\s+exec total=(?P<exec_total>\d+)\s+"
)
CRASH_MARKERS = ("SYZFAIL", "BUG:", "KASAN", "WARNING", "panic")
TIMEOUT_MARKERS = ("no output from executor", "executor no output", "hung", "lost connection")


def build_time_anchors(path: str):
    anchors = []
    with open(path, "r", errors="replace") as f:
        for line in f:
            m = STATS_LINE_RE.match(line)
            if not m:
                continue
            dt = datetime.strptime(
                f"{m.group('date')} {m.group('time')}", "%Y/%m/%d %H:%M:%S"
            ).replace(tzinfo=timezone.utc)
            anchors.append((int(m.group("exec_total")), dt.timestamp()))
    anchors.sort()
    return anchors


def parse_log(log_path: str, anchors):
    def count_executions():
        total = 0
        current_id = None
        current_syscalls = []
        with open(log_path, "r", errors="replace") as f:
            for line in f:
                m = REQUEST_START_RE.search(line)
                if m:
                    if current_id is not None and current_syscalls:
                        total += 1
                    current_id = m.group(2)
                    current_syscalls = []
                    continue
                sc = SYSCALL_LINE_RE.search(line)
                if sc and current_id is not None:
                    current_syscalls.append(1)
            if current_id is not None and current_syscalls:
                total += 1
        return total

    total_execs = count_executions()
    start_ts = anchors[0][1] if anchors else datetime.now(tz=timezone.utc).timestamp()
    end_ts = anchors[-1][1] if anchors else start_ts

    executions = []
    current_id = None
    current_worker = 0
    current_syscalls = []
    current_lines = []
    exec_ordinal = 0

    def flush():
        nonlocal current_id, current_syscalls, current_lines, exec_ordinal
        if current_id is None or not current_syscalls:
            current_id, current_syscalls, current_lines = None, [], []
            return

        exec_ordinal += 1
        frac = (exec_ordinal - 1) / max(total_execs - 1, 1)
        ts = start_ts + frac * (end_ts - start_ts)

        times = [t for (_, t, _, _) in current_syscalls]
        duration_ms = (max(times) - min(times)) if len(times) > 1 else (times[0] if times else 0)

        joined = "\n".join(current_lines)
        if any(marker in joined for marker in CRASH_MARKERS):
            result = "crash"
        elif any(marker in joined for marker in TIMEOUT_MARKERS):
            result = "timeout"
        else:
            result = "success"

        executions.append({
            "id": f"exec-{current_id}",
            "timestamp": datetime.fromtimestamp(ts, tz=timezone.utc).isoformat(),
            "duration": round(duration_ms / 1000.0, 3),
            "cpuUsage": 0,
            "memUsageMB": 0,
            "coverage": 0,
            "result": result,
            "policy": "Random",
            "syscallCount": len({sid for (sid, _, _, _) in current_syscalls}),
            "newEdges": 0,
            "workerID": current_worker,
        })
        current_id, current_syscalls, current_lines = None, [], []

    with open(log_path, "r", errors="replace") as f:
        for line in f:
            m = REQUEST_START_RE.search(line)
            if m:
                flush()
                current_worker = int(m.group(1))
                current_id = m.group(2)
                continue

            sc = SYSCALL_LINE_RE.search(line)
            if sc and current_id is not None:
                sid, t, direction, name = sc.groups()
                current_syscalls.append((sid, int(t), direction, name))

            if current_id is not None:
                current_lines.append(line)

        flush()

    return executions


def main():
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <syz-manager-debug.log> <output.json>", file=sys.stderr)
        sys.exit(1)

    log_path, out_path = sys.argv[1], sys.argv[2]
    anchors = build_time_anchors(log_path)
    executions = parse_log(log_path, anchors)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(executions, f, indent=2)

    print(f"Wrote {len(executions)} execution records to {out_path} "
          f"(interpolated from {len(anchors)} time anchors)")


if __name__ == "__main__":
    main()
