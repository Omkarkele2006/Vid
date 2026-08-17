\# VID — Architecture Documentation



\*\*AI-Guided Adaptive Kernel Runtime Intelligence Framework\*\*

CDAC National Level SSM Hackathon 2026 — Team Open Thinkers



This document contains all 7 architecture diagrams for VID, covering system structure, data flow, execution behavior, and deployment. Diagrams are provided both as rendered PNG images and as Mermaid source code (GitHub renders Mermaid natively in any `.md` file).



\---



\## 1. System Architecture



The complete 7-module pipeline from the Linux kernel through to the visualization dashboard.



!\[System Architecture](screenshots/diagram1-system-architecture.png)



```mermaid

graph LR

&#x20; K\["🐧 Linux Kernel\\nSyscalls · KCOV · KASAN"]

&#x20; S\["⚙️ Syzkaller\\nFuzzing Engine"]

&#x20; F\["🔍 Feature Extraction\\nYash"]

&#x20; A\["🧠 AI Policy Engine\\nOm"]

&#x20; B\["📊 Benchmark Engine\\nYash"]

&#x20; V\["📈 Visualization\\nDevayani"]

&#x20; E\["🗂 Experiment Manager"]



&#x20; K -->|Telemetry| S

&#x20; S -->|Program Metadata| F

&#x20; F -->|Feature Vector| A

&#x20; A -->|Action| S

&#x20; A -->|Logs \& Rewards| B

&#x20; B -->|Coverage Data| V

&#x20; V -->|Reports| E



&#x20; style V fill:#92400e,stroke:#f59e0b,color:#fff

&#x20; style A fill:#312e81,stroke:#818cf8,color:#fff

&#x20; style F fill:#1e3a5f,stroke:#60a5fa,color:#fff

```



\*\*Module ownership:\*\*

\- Linux Kernel + Syzkaller integration — Om

\- Feature Extraction + Benchmark Engine — Yash

\- AI Policy Engine — Om

\- Visualization Dashboard — Devayani



\---



\## 2. Data Flow Diagram



Shows how raw kernel telemetry becomes a feature vector, an AI decision, and finally a chart on the dashboard.



!\[Data Flow](screenshots/diagram2-data-flow.png)



```mermaid

flowchart TD

&#x20; KCOV\[KCOV Coverage Output] --> FE\[Feature Extraction]

&#x20; KASAN\[KASAN Crash Reports] --> FE

&#x20; SYZLOG\[Syzkaller Exec Logs] --> FE

&#x20; FE --> FEAT\[Feature Vector\\ncoverage · program · temporal · crash]

&#x20; FEAT --> AI\[AI Policy Engine\\nUCB · RL-DQN · PPO]

&#x20; AI --> ACTION\[Action\\nnext program + mutation strategy]

&#x20; ACTION --> SYZ\[Syzkaller]

&#x20; AI --> REWARD\[Reward Signal\\ncoverage gain · crash found]

&#x20; REWARD --> AI

&#x20; AI --> JSON\[results/\*.json\\ncoverage · crashes · executions]

&#x20; JSON --> DASH\[Visualization Dashboard]

```



\---



\## 3. Execution Pipeline



The continuous fuzzing loop: generate, execute, measure, decide, repeat.



!\[Execution Pipeline](screenshots/diagram3-execution-pipeline.png)



```mermaid

flowchart LR

&#x20; GEN\[Generate Program\\nSyzkaller corpus] --> EXEC\[Execute Syscalls\\nin QEMU/KVM]

&#x20; EXEC --> KCOV2\[KCOV records\\nedge coverage]

&#x20; KCOV2 --> KASAN2\[KASAN checks\\nmemory safety]

&#x20; KASAN2 --> FEAT2\[Extract Features\\ncoverage + crash signals]

&#x20; FEAT2 --> AI2\[AI Policy\\nselects next program]

&#x20; AI2 --> GEN

&#x20; KASAN2 -->|crash found| CRASH\[Save crash\\nto crashes.json]

```



\---



\## 4. Component Diagram



Which files and folders belong to which team member, and the shared data contract between them.



!\[Component Diagram](screenshots/diagram4-component-diagram.png)



```mermaid

graph TB

&#x20; subgraph OM \["Om's Modules"]

&#x20;   KERN\[kernel/]

&#x20;   AI3\[ai-engine/]

&#x20; end

&#x20; subgraph YASH \["Yash's Modules"]

&#x20;   FE3\[feature-extraction/]

&#x20;   BENCH\[benchmark/]

&#x20; end

&#x20; subgraph DEV \["Devayani's Modules"]

&#x20;   VIS\[visualization/dashboard/]

&#x20;   DOCS\[docs/]

&#x20; end

&#x20; subgraph SHARED \["Shared Contract"]

&#x20;   DATA\[results/\*.json]

&#x20; end



&#x20; YASH --> DATA

&#x20; OM --> DATA

&#x20; DATA --> DEV

```



\---



\## 5. Sequence Diagram



Time-ordered messages between the fuzzer, feature extractor, AI engine, and dashboard.



!\[Sequence Diagram](screenshots/diagram5-sequence-diagram.png)



```mermaid

sequenceDiagram

&#x20; participant SYZ as Syzkaller

&#x20; participant KCOV as KCOV

&#x20; participant FE as Feature Extractor

&#x20; participant AI as AI Policy Engine

&#x20; participant DASH as Dashboard



&#x20; SYZ->>KCOV: Execute program

&#x20; KCOV-->>FE: Coverage bitmap

&#x20; SYZ-->>FE: Execution metadata

&#x20; FE->>AI: Feature vector

&#x20; AI-->>SYZ: Next program + strategy

&#x20; AI->>DASH: Update coverage.json

&#x20; SYZ-->>DASH: Update crashes.json

&#x20; DASH->>DASH: Re-render charts

```



\---



\## 6. Benchmark Flow



How a baseline run and an adaptive run are compared to prove VID's improvement over standard Syzkaller.



!\[Benchmark Flow](screenshots/diagram6-benchmark-flow.png)



```mermaid

flowchart TD

&#x20; BASE\[Baseline Run\\nStandard Syzkaller] --> BMET\[Baseline Metrics\\ncoverage · crashes · speed]

&#x20; ADAPT\[Adaptive Run\\nVID + AI Policy] --> AMET\[Adaptive Metrics\\ncoverage · crashes · speed]

&#x20; BMET --> COMP\[Benchmark Comparison\\nbenchmark.json]

&#x20; AMET --> COMP

&#x20; COMP --> DASH2\[Dashboard\\nBenchmark Comparison page]

```



\*\*Status:\*\* Baseline run is complete (Random policy, stock test kernel, 756 coverage points, 3 crashes, \~5,793 executions). Adaptive run comparison is pending Om's Policy V2 (Issue #24).



\---



\## 7. Deployment Diagram



Where each process runs — host machine versus the QEMU/KVM virtual machine.



!\[Deployment Diagram](screenshots/diagram7-deployment-diagram.png)



```mermaid

graph TB

&#x20; subgraph HOST \["Host Machine — Ubuntu 22.04 / WSL2"]

&#x20;   SYZ2\[Syzkaller Manager]

&#x20;   FE4\[Feature Extractor]

&#x20;   AI4\[AI Policy Engine]

&#x20;   BENCH2\[Benchmark Runner]

&#x20;   DASH3\[Dashboard — localhost:5173]

&#x20; end

&#x20; subgraph VM \["QEMU/KVM Virtual Machine"]

&#x20;   KERN2\[Linux Kernel 6.x\\nKCOV + KASAN enabled]

&#x20; end

&#x20; SYZ2 <-->|SSH + RPC| VM

&#x20; FE4 --> SYZ2

&#x20; AI4 --> FE4

&#x20; BENCH2 --> AI4

&#x20; DASH3 --> |reads| DATA2\[results/\*.json]

```



\---



\## Current Project Status (as of Aug 17, 2026)



| Component | Status |

|---|---|

| Linux Kernel + KCOV + KASAN | ✅ Compiled, booting in QEMU (stock test kernel) |

| Syzkaller baseline fuzzing | ✅ Working, validated (Random policy) |

| Feature Extraction | ✅ 3 scripts complete — coverage, crashes, executions |

| Visualization Dashboard | ✅ 11 pages, real data wired in, export functions working |

| AI Policy Engine (V1 heuristic) | ✅ Built, evaluated — needs more granular data |

| Unified syscall-level telemetry | 🔲 In progress (Issue #23) |

| AI Policy Engine V2 (adaptive) | 🔲 In progress (Issue #24) |

| Benchmark comparison (2 policies) | 🔲 Blocked on Policy V2 |

| Real Linux 7.1.8 kernel connection | 🔲 Blocked on kernel image transfer (Phase B) |

