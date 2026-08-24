# VID — AI-Guided Adaptive Kernel Runtime Intelligence Framework

> National Level SSM Hackathon 2026 · CDAC · Track: AI Usage at OS-Kernel Level
> Team: **Open Thinkers** — Om Karkele · Yash Kashid · Devayani Jadhav

---

## What is VID?

VID is an AI-powered Linux kernel fuzzing framework that sits **on top of Syzkaller**
and guides kernel exploration using an adaptive intelligence layer.

Standard Syzkaller uses fixed scheduling heuristics. VID replaces the decision
layer with a contextual bandit (UCB) and, going forward, reinforcement learning
policies that continuously learn from runtime coverage feedback to improve
fuzzing efficiency.

**VID does not replace Syzkaller. It makes Syzkaller smarter.**

---

## Architecture

Full diagrams with explanations: [`docs/architecture.md`](docs/architecture.md)
Linux Kernel (KCOV + KASAN)
↓ telemetry
Syzkaller
↓ program metadata
Feature Extraction Engine ← Yash
↓ feature vector
AI Policy Engine (UCB/RL) ← Om
↓ action
Syzkaller (loop)
↓ results
Benchmark & Analytics ← Yash
↓ JSON output
Visualization Dashboard ← Devayani
---

## Team Responsibilities

| Member | Module | Key Deliverable |
|---|---|---|
| Om Karkele | Kernel setup · AI policy engine | Ubuntu/QEMU/KCOV working · adaptive policy engine |
| Yash Kashid | Feature extraction · Benchmark engine | Syzkaller integration · baseline vs adaptive results |
| Devayani Jadhav | Visualization dashboard · Docs · Presentation | Enterprise dashboard · architecture diagrams |

---

## Running the Dashboard

```bash
cd visualization/dashboard
npm install
npm run dev
# Open http://localhost:5173
```

The dashboard reads real fuzzing telemetry from `results/coverage.json`,
`results/crashes.json`, and `results/executions.json` at the repo root.

---

## Current Project Status (as of Aug 17, 2026)

- [x] Linux kernel with KCOV + KASAN compiled and booting in QEMU (stock test kernel)
- [x] Syzkaller baseline fuzzing validated — coverage growing, stable exec rate
- [x] Feature Extraction pipeline — coverage.json, crashes.json, executions.json (real data)
- [x] Visualization dashboard — 11 pages, real data wired in, export functions working
- [x] AI Policy V1 (heuristic) built and evaluated
- [ ] Unified syscall-level telemetry (Issue #23)
- [ ] AI Policy V2 — adaptive bandit policy (Issue #24)
- [ ] Benchmark comparison — requires 2 policies (blocked on Policy V2)
- [ ] Real Linux 7.1.8 kernel connection (Phase B — pending kernel image)

---

## Repository Structure
Vid/
├── kernel/ # Om — kernel build, QEMU/KVM setup
├── ai-engine/ # Om — adaptive policy engine
├── feature-extraction/ # Yash — KCOV/crash parsing scripts
├── benchmark/ # Yash — experiment automation
├── visualization/
│ └── dashboard/ # Devayani — React dashboard
├── results/ # Shared: real fuzzing telemetry JSON
└── docs/
├── architecture.md # All 7 architecture diagrams
└── screenshots/ # Diagram PNGs + dashboard screenshots
---

## Submission Deadline — 25 August 2026