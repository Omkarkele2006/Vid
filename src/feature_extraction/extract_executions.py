#!/usr/bin/env python3
"""
Vid — Feature Extraction Engine (executions)

Parses syz-manager's -debug log for individual program executions. Each
execution is bounded by "start executing request N" / "recv exec request N"
markers and contains a sequence of syscall trace lines like:

  #0 [171ms] -> bind(0xffffffffffffffff, 0x200000000000, 0x0)
  #0 [171ms] <- bind=0xffffffffffffffff errno=9

Emits executions.json matching the dashboard's Execution TypeScript interface:

  id, timestamp, duration, cpuUsage, memUsageMB, coverage, result,
  policy, syscallCount, newEdges, workerID

NOTE: cpuUsage / memUsageMB / coverage / newEdges are not directly present
in the -debug text log. They are left as 0 placeholders here. duration and
syscallCount ARE real, parsed from the syscall trace timestamps.

Usage:
    python3 extract_executions.py /home/kashid/syzkaller-workdir/live-debug.log results/executions.json
"""

import sys
import os
import re
import json
from datetime import datetime, timezone

REQUEST_START_RE = re.compile(r"(?:start executing request|recv exec request)\s+(\d+)")
SYSCALL_LINE_RE = re.compile(r"#(\d+)\s+\[(\d+)ms\]\s+(->|<-)\s+(\w+)")
CRASH_MARKERS = ("SYZFAIL", "BUG:", "KASAN", "WARNING", "panic")
# NOTE: "timeouts=50/5000/1" appears in every exec's "exec opts:" line as a
# CONFIG value (timeout limits in ms), not an event -- must not match that.
TIMEOUT_MARKERS = ("no output from executor", "executor no output", "hung", "lost connection")

def parse_log(path: str, base_time: datetime):
    executions = []
    current_id = None
    current_syscalls = []
    current_lines = []

    def flush():
        nonlocal current_id, current_syscalls, current_lines
        if current_id is None or not current_syscalls:
            current_id, current_syscalls, current_lines = None, [], []
            return

        times = [t for (_, t, _, _) in current_syscalls]
        duration_ms = (max(times) - min(times)) if len(times) > 1 else times[0] if times else 0

        joined = "\n".join(current_lines)
        if any(marker in joined for marker in CRASH_MARKERS):
            result = "crash"
        elif any(marker in joined for marker in TIMEOUT_MARKERS):
            result = "timeout"
        else:
            result = "success"

        executions.append({
            "id": f"exec-{current_id}",
            "timestamp": base_time.isoformat(),
            "duration": round(duration_ms / 1000.0, 3),
            "cpuUsage": 0,
            "memUsageMB": 0,
            "coverage": 0,
            "result": result,
            "policy": "Random",
            "syscallCount": len({sid for (sid, _, _, _) in current_syscalls}),
            "newEdges": 0,
            "workerID": 0,
        })
        current_id, current_syscalls, current_lines = None, [], []

    with open(path, "r", errors="replace") as f:
        for line in f:
            m = REQUEST_START_RE.search(line)
            if m:
                flush()
                current_id = m.group(1)
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
    base_time = datetime.now(tz=timezone.utc)
    executions = parse_log(log_path, base_time)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(executions, f, indent=2)

    print(f"Wrote {len(executions)} execution records to {out_path}")

if __name__ == "__main__":
    main()
