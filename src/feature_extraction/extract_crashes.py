#!/usr/bin/env python3
"""
Vid — Feature Extraction Engine (crashes)

Reads Syzkaller's workdir/crashes/<hash>/ directories and emits a single
crashes.json matching the dashboard's Crash TypeScript interface:

  id, timestamp, type, subsystem, severity, reproduced,
  timeToFirst, memAddr, syscall, stackDepth, program, status, policyUsed

Usage:
    python3 extract_crashes.py /home/kashid/syzkaller-workdir/workdir/crashes results/crashes.json
"""

import sys
import os
import re
import json
import glob
from datetime import datetime, timezone

SEVERITY_RULES = [
    (re.compile(r"KASAN: use-after-free|KASAN: double-free|general protection fault", re.I), "critical"),
    (re.compile(r"KASAN|BUG:|kernel panic|null pointer dereference", re.I), "high"),
    (re.compile(r"WARNING", re.I), "medium"),
    (re.compile(r"INFO:|suppress", re.I), "low"),
]

# Infra/tooling noise that shows up in Syzkaller's crashes/ dir but is NOT a
# real kernel bug -- these are our own VM/SSH/QEMU setup failures getting
# mistakenly logged as "crashes" by syzkaller's crash-triage. Filter them out
# so they don't pollute real kernel-crash data sent downstream.
NOISE_TITLE_PATTERNS = [
    re.compile(r"can't ssh into the instance", re.I),
    re.compile(r"failed to read from qemu", re.I),
    re.compile(r"SYZFAIL", re.I),
    re.compile(r"lost connection to test machine", re.I),
    re.compile(r"no output from executor", re.I),
]

def is_infra_noise(title: str) -> bool:
    return any(p.search(title) for p in NOISE_TITLE_PATTERNS)

def classify_severity(title: str) -> str:
    for pattern, sev in SEVERITY_RULES:
        if pattern.search(title):
            return sev
    return "medium"

def classify_type(title: str) -> str:
    m = re.match(r"^(.*?)\s+in\s+", title)
    if m:
        return m.group(1).strip()
    return title.strip()

def extract_syscall(title: str, report_text: str) -> str:
    m = re.search(r"\bin\s+([A-Za-z0-9_./]+)", title)
    if m:
        return m.group(1)
    return "unknown"

def extract_subsystem(report_text: str) -> str:
    m = re.search(r"\b([a-z0-9_]+)/[a-z0-9_./]+\.c\b", report_text)
    if m:
        return m.group(1)
    return "unknown"

def extract_mem_addr(report_text: str) -> str:
    m = re.search(r"\b(0x[0-9a-fA-F]{8,})\b", report_text)
    return m.group(1) if m else ""

def extract_stack_depth(report_text: str) -> int:
    m = re.search(r"<TASK>(.*?)</TASK>", report_text, re.S)
    if not m:
        return 0
    lines = [l for l in m.group(1).splitlines() if l.strip()]
    return len(lines)

def process_crash_dir(crash_dir: str):
    hash_id = os.path.basename(crash_dir.rstrip("/"))
    desc_path = os.path.join(crash_dir, "description")
    if not os.path.exists(desc_path):
        return None

    with open(desc_path, "r", errors="replace") as f:
        title = f.read().strip()

    if is_infra_noise(title):
        return None

    report_files = sorted(glob.glob(os.path.join(crash_dir, "report*")))
    if not report_files:
        return None

    mtimes = [os.path.getmtime(rf) for rf in report_files]
    first_ts = min(mtimes)
    last_ts = max(mtimes)

    latest_report = report_files[mtimes.index(last_ts)]
    with open(latest_report, "r", errors="replace") as f:
        report_text = f.read()

    reproduced = len(report_files) > 1

    return {
        "id": hash_id,
        "timestamp": datetime.fromtimestamp(first_ts, tz=timezone.utc).isoformat(),
        "type": classify_type(title),
        "subsystem": extract_subsystem(report_text),
        "severity": classify_severity(title),
        "reproduced": reproduced,
        "timeToFirst": int(first_ts),
        "memAddr": extract_mem_addr(report_text),
        "syscall": extract_syscall(title, report_text),
        "stackDepth": extract_stack_depth(report_text),
        "program": "",
        "status": "open",
        "policyUsed": "Random",
    }

def main():
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <crashes_dir> <output.json>", file=sys.stderr)
        sys.exit(1)

    crashes_root, out_path = sys.argv[1], sys.argv[2]
    results = []

    for entry in sorted(os.listdir(crashes_root)):
        full = os.path.join(crashes_root, entry)
        if not os.path.isdir(full):
            continue
        record = process_crash_dir(full)
        if record:
            results.append(record)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"Wrote {len(results)} crash records to {out_path}")

if __name__ == "__main__":
    main()
