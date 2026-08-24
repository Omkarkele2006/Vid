# VID — AI-Guided Adaptive Kernel Runtime Intelligence Framework

> **National Level SSM Hackathon 2026 · CDAC**  
> **Track:** Open Innovation — Linux Based  
> **Team:** Open Thinkers — Om Karkele · Yash Kashid · Devayani Jadhav

## 🚀 Overview

**VID** is an AI-guided adaptive Linux kernel fuzzing framework built on top of **Syzkaller**.

Traditional kernel fuzzing relies heavily on fixed scheduling heuristics. VID introduces a **syscall-level adaptive policy engine** that analyses runtime coverage and execution telemetry to prioritize system calls based on their observed exploration value.

> **VID does not replace Syzkaller — it makes Syzkaller smarter.**

## 🧠 How VID Works

```text
Linux Kernel
     │
     ▼
 KCOV / KASAN
     │
     ▼
 Syzkaller
     │
     ▼
Runtime Telemetry
     │
     ▼
Feature Extraction
     │
     ▼
Adaptive Policy V2
     │
     ▼
Syscall Priorities
     │
     ▼
Guided Fuzzing
     │
     └──────────────► Feedback Loop
```

VID converts runtime fuzzing behaviour into structured telemetry and uses that information to make adaptive syscall-level decisions.

## ⚡ Adaptive Policy V2

VID currently implements **AdaptiveSyscallV2**, which analyses syscall-level telemetry including:

- New coverage contribution
- Execution frequency
- Error behaviour
- Maximum observed coverage
- Runtime syscall signals

### Current Validated Run

| Metric | Result |
|---|---:|
| Execution Events | **3,584** |
| Syscall Observations | **6,405** |
| Syscalls Analysed | **296** |
| High Priority | **75** |
| Medium Priority | **103** |
| Low Priority | **118** |
| Average Policy Score | **0.5531** |

Policy decisions are generated at:

```text
results/policy_v2_decisions.json
```

## 📊 Real Telemetry

VID works with real Linux kernel fuzzing telemetry:

```text
results/
├── coverage.json
├── crashes.json
├── executions.json
├── syscall_events.jsonl
├── syscall_events_sample.jsonl
└── policy_v2_decisions.json
```

Current dataset:

- **9,540** execution records
- **68** coverage records
- **3,584** execution events used by Policy V2
- **6,405** syscall observations
- **296** syscalls analysed
- **0** recorded kernel crashes in the current dataset

The dashboard reports unavailable or zero measurements honestly instead of using fabricated runtime data.

## 🖥️ Visualization Dashboard

VID includes a **React + TypeScript** dashboard for analysing:

- Coverage growth
- Execution telemetry
- Syscall observations
- Adaptive Policy V2 decisions
- Syscall priorities
- Crash analytics
- System and architecture information
- Reports and analytics

### Run the Dashboard

```bash
cd visualization/dashboard
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## ▶️ Run Adaptive Policy V2

From the repository root:

```bash
python -m scripts.run_policy_v2
```

Expected output:

```text
Running VID Adaptive Policy V2...

Execution events : 3584
Syscall events   : 6405

Policy            : AdaptiveSyscallV2
Syscalls analyzed: 296
High priority     : 75
Medium priority   : 103
Low priority      : 118
Average score     : 0.5531
```

## 🛠️ Technology Stack

**Kernel & Fuzzing:** `Linux 7.1.8` · `Syzkaller` · `KCOV` · `KASAN` · `QEMU`

**Adaptive Intelligence:** `Python` · `Adaptive Syscall-Level Policy`

**Dashboard:** `React` · `TypeScript` · `Vite` · `Tailwind CSS` · `Recharts`

**Testing:** `Pytest`

## 📁 Repository Structure

```text
Vid/
├── kernel/                   # Linux kernel configuration
├── src/
│   ├── feature_extraction/  # Runtime telemetry extraction
│   ├── policy_engine/       # Adaptive Policy V2
│   ├── integration/
│   └── utils/
├── scripts/                  # Policy execution scripts
├── results/                  # Real fuzzing telemetry and results
├── tests/                    # Automated tests
├── visualization/
│   └── dashboard/            # React visualization dashboard
└── docs/                     # Architecture and documentation
```

## ✅ Validation

```text
Adaptive Policy V2       ✓ Implemented
Syscall Telemetry        ✓ Implemented
Real Telemetry           ✓ Integrated
Policy Decisions         ✓ Generated
Dashboard                ✓ Integrated
Dashboard Build          ✓ Passed
Automated Tests          ✓ 4 Passed
```

Run tests from the repository root:

```bash
python -m pytest
```

## 👥 Team — Open Thinkers

| Member | Responsibility |
|---|---|
| **Om Karkele** | Kernel Setup · System Architecture · Adaptive Policy Engine |
| **Yash Kashid** | Feature Extraction · Telemetry · Benchmarking |
| **Devayani Jadhav** | Visualization · Documentation · Presentation |

## 📄 Documentation

Detailed architecture and system diagrams:

```text
docs/architecture.md
```

Baseline results:

```text
docs/baseline-results.md
```

Dashboard documentation:

```text
visualization/dashboard/README.md
```

Architecture diagrams:

```text
docs/screenshots/
```

---

## 🎯 Vision

VID aims to make Linux kernel fuzzing more **adaptive, coverage-aware, observable, and intelligence-driven** by closing the feedback loop between kernel execution telemetry and fuzzing decisions.

> **Execute → Observe → Learn → Prioritize → Explore**
