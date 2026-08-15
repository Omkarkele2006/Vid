#!/usr/bin/env python3
"""
Vid — Feature Extraction Engine (coverage)

Parses syz-manager's periodic stats log lines, e.g.:

  2026/08/13 17:24:42 candidates=0 corpus=275 coverage=61302 exec total=5794 (45/min) pending=7 reproducing=1

into coverage.json matching the dashboard's CoveragePoint TypeScript interface:

  timestamp, coverage, edges, newEdges, executions, policy

Usage:
    python3 extract_coverage.py /home/kashid/syzkaller-workdir/live-debug.log results/coverage.json
"""

import sys
import os
import re
import json
from datetime import datetime, timezone

LINE_RE = re.compile(
    r"^(?P<date>\d{4}/\d{2}/\d{2})\s+(?P<time>\d{2}:\d{2}:\d{2})\s+"
    r"candidates=(?P<candidates>\d+)\s+"
    r"corpus=(?P<corpus>\d+)\s+"
    r"coverage=(?P<coverage>\d+)\s+"
    r"exec total=(?P<exec_total>\d+)\s+"
    r"\((?P<rate>\d+)/min\)\s+"
    r"pending=(?P<pending>\d+)\s+"
    r"reproducing=(?P<reproducing>\d+)"
)

def parse_log(path: str):
    points = []
    prev_coverage = None
    prev_exec_total = None

    with open(path, "r", errors="replace") as f:
        for line in f:
            m = LINE_RE.match(line)
            if not m:
                continue

            dt_str = f"{m.group('date')} {m.group('time')}"
            dt = datetime.strptime(dt_str, "%Y/%m/%d %H:%M:%S").replace(tzinfo=timezone.utc)

            coverage = int(m.group("coverage"))
            exec_total = int(m.group("exec_total"))

            new_edges = 0 if prev_coverage is None else max(0, coverage - prev_coverage)
            executions_delta = exec_total if prev_exec_total is None else max(0, exec_total - prev_exec_total)

            points.append({
                "timestamp": dt.isoformat(),
                "coverage": coverage,
                "edges": coverage,
                "newEdges": new_edges,
                "executions": executions_delta,
                "policy": "Random",
            })

            prev_coverage = coverage
            prev_exec_total = exec_total

    return points

def main():
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <syz-manager-debug.log> <output.json>", file=sys.stderr)
        sys.exit(1)

    log_path, out_path = sys.argv[1], sys.argv[2]
    points = parse_log(log_path)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(points, f, indent=2)

    print(f"Wrote {len(points)} coverage points to {out_path}")

if __name__ == "__main__":
    main()
