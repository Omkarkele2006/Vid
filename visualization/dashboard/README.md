# VID — Visualization & Reporting Module

**AI-Guided Adaptive Kernel Runtime Intelligence Framework**
National Level SSM Hackathon 2026 · CDAC · Team **Open Thinkers**
Module owner: **Devayani Jadhav** (Visualization Dashboard · Architecture Diagrams · Presentation · Documentation)

This module is the **enterprise-grade observability layer** for VID. It does not touch the kernel,
Syzkaller, the AI policy engine, or the benchmark engine — it only **consumes their output** (coverage,
crash, execution, and policy telemetry) and renders it as a Datadog/Grafana-class dashboard.

---

## 1. Folder Structure

```
vid-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/         # Sidebar, Topbar, AppLayout — the app shell
│   │   ├── cards/           # KpiCard and other stat-card primitives
│   │   ├── charts/          # (extend here) reusable chart wrappers
│   │   ├── tables/          # (extend here) reusable table primitives
│   │   ├── ui/               # Badge and other small design-system atoms
│   │   ├── architecture/    # (extend here) diagram-specific components
│   │   └── reports/         # (extend here) report/export components
│   ├── pages/
│   │   ├── dashboard/       # Dashboard Home (KPIs, live charts, activity)
│   │   ├── coverage/        # Coverage Analytics
│   │   ├── crashes/         # Crash Analytics
│   │   ├── ai-policy/       # AI Policy Performance
│   │   ├── architecture/    # Architecture Viewer (Mermaid + explanations)
│   │   └── stubs.tsx        # Timeline, Benchmark, System Health, Reports,
│   │                          Settings, About — same patterns, lighter pages
│   ├── mock-data/           # Realistic generated telemetry (500–1000 rows)
│   ├── types/                # Shared TypeScript interfaces
│   ├── utils/                # Formatting, color, and class-name helpers
│   ├── styles/                # globals.css — glassmorphism theme, tokens
│   ├── hooks/                 # (extend here) custom React hooks
│   ├── animations/           # (extend here) shared Framer Motion variants
│   ├── assets/icons/         # (extend here) custom SVG icon assets
│   ├── App.tsx                # Router — all 11 pages wired up
│   └── main.tsx               # Entry point
├── docs/                      # (extend here) architecture / usage docs
├── tailwind.config.js         # Design tokens: vid-bg, vid-blue, vid-purple…
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Why this structure:** it separates *what things look like* (`components/ui`, `styles`) from
*what a page does* (`pages/*`) from *what data looks like* (`mock-data`, `types`), so any teammate
can swap mock data for real API/WebSocket data in `mock-data/index.ts` without touching a single
component.

---

## 2. What's implemented

| Phase | Status | Notes |
|---|---|---|
| 1 — Folder structure | ✅ | Above |
| 2 — Dashboard shell | ✅ | Sidebar, Topbar, search, notifications, breadcrumbs, profile |
| 3 — Pages | ✅ | 11 routed pages (Dashboard Home, Coverage, Crashes, Timeline, Benchmark, AI Policy, System Health, Reports, Architecture, Settings, About) |
| 4 — Charts | ✅ | Area, Line, Bar, Pie, Radar, Scatter, Composed (Recharts) |
| 5 — KPI cards | ✅ | Animated count-up `KpiCard` component, 12 metrics on Dashboard Home |
| 6 — Tables | ✅ | Crash log with search/filter/pagination; execution & report tables |
| 7 — Architecture | ✅ | Custom animated pipeline diagram + Mermaid source block + 7 component explainers |
| 8 — Reusable components | ✅ | `KpiCard`, `Badge`, `Sidebar`, `Topbar`, `AppLayout` — extend `components/ui` for more |
| 9 — Animations | ✅ | Framer Motion page transitions, staggered card entrances, hover lifts |
| 10 — Mock data | ✅ | 500 coverage points, 200 crashes, 1000 executions, 100 policy epochs |
| 11 — Reporting | ✅ | Report gallery UI (PDF/MD/CSV/JSON export cards) |
| 12 — Accessibility | ◐ | Semantic HTML, focus-visible via Tailwind defaults; ARIA labels to extend |
| 13 — Code quality | ✅ | Typed end-to-end, modular, one component per file |
| 14 — Documentation | ✅ | This file |

---

## 3. Design system

- **Theme:** Dark, glassmorphism (`backdrop-filter: blur`), blue/purple/cyan cybersecurity accents.
- **Tokens:** defined in `tailwind.config.js` under `colors.vid.*` — never hardcode hex values in components, use `vid-blue`, `vid-purple`, `vid-cyan`, `vid-card`, `vid-border`, etc.
- **Cards:** use the `.glass-card` / `.glass-card-hover` utility classes from `globals.css`.
- **Typography:** Inter (UI), JetBrains Mono (IDs, metrics, code).

---

## 4. Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build
```

## 5. Wiring in real data

Everything the dashboard renders is imported from `src/mock-data/index.ts`. To connect the real
pipeline (Yash's Feature Extraction / Benchmark Engine output, Om's AI Policy Engine logs):

1. Keep the same shape as the `types/index.ts` interfaces (`Crash`, `Execution`, `CoveragePoint`, `BenchmarkEntry`, `KpiSummary`).
2. Replace the static exports in `mock-data/index.ts` with a fetch/WebSocket hook in `src/hooks/`.
3. Components don't need to change — they only depend on the typed shape, not the source.

---

*Generated for the CDAC National Level SSM Hackathon 2026 — Open Thinkers.*
