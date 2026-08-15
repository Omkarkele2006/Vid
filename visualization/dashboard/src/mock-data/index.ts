// ============================================================
// VID Mock Data – Realistic kernel fuzzing telemetry
// ============================================================

import { addMinutes, subDays, subHours, format } from 'date-fns';

// ── helpers ──────────────────────────────────────────────────
const rng = (min: number, max: number, dec = 0) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const ts = (minsAgo: number) =>
  format(addMinutes(new Date(), -minsAgo), "yyyy-MM-dd'T'HH:mm:ss");

// ── Coverage data (500 points, 30-day window) ────────────────
export const coverageTimeline = Array.from({ length: 500 }, (_, i) => ({
  timestamp:   format(subDays(new Date(), 30 - (i / 500) * 30), "yyyy-MM-dd'T'HH:mm:ss"),
  coverage:    Math.min(95, 20 + Math.sqrt(i) * 3.3 + rng(-1, 2, 2)),
  edges:       Math.floor(12000 + i * 160 + rng(-200, 200)),
  newEdges:    Math.floor(Math.max(0, 160 - i * 0.25 + rng(-20, 40))),
  executions:  Math.floor(i * 120 + rng(0, 500)),
  policy:      pick(['UCB', 'RL-DQN', 'Random', 'RoundRobin', 'PPO']),
}));

// ── Crash data (200 crashes) ──────────────────────────────────
const crashTypes = ['KASAN: use-after-free', 'NULL pointer dereference', 'Stack overflow', 'KASAN: heap-buffer-overflow', 'BUG: soft lockup', 'WARNING: suspicious RCU', 'general protection fault', 'divide error'];
const subsystems = ['mm', 'net', 'fs', 'usb', 'sound', 'gpu', 'crypto', 'ipc', 'sched', 'vfs'];
const severities: string[] = ['critical', 'high', 'medium', 'low'];

export const crashes = Array.from({ length: 200 }, (_, i) => ({
  id:          `crash-${String(i + 1).padStart(4, '0')}`,
  timestamp:   ts(rng(0, 43200)),
  type:        pick(crashTypes),
  subsystem:   pick(subsystems),
  severity:    pick(severities),
  reproduced:  Math.random() > 0.3,
  timeToFirst: rng(120, 28800, 0),
  memAddr:     `0x${Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0')}`,
  syscall:     pick(['mmap', 'write', 'read', 'open', 'socket', 'ioctl', 'clone', 'sendmsg', 'recvmsg', 'epoll_wait']),
  stackDepth:  Math.floor(rng(5, 32)),
  program:     `prog-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}.syz`,
  status:      pick(['open', 'triaged', 'fixed', 'duplicate', 'wontfix']),
  policyUsed:  pick(['UCB', 'RL-DQN', 'Random', 'RoundRobin']),
}));

// ── Execution timeline (1000 executions) ─────────────────────
export const executions = Array.from({ length: 1000 }, (_, i) => ({
  id:           `exec-${String(i + 1).padStart(5, '0')}`,
  timestamp:    ts(rng(0, 14400)),
  duration:     rng(0.05, 12.5, 3),
  cpuUsage:     rng(10, 98, 1),
  memUsageMB:   rng(64, 8192, 1),
  coverage:     rng(15, 94, 2),
  result:       pick(['success', 'crash', 'timeout', 'skip']),
  policy:       pick(['UCB', 'RL-DQN', 'Random', 'RoundRobin', 'PPO']),
  syscallCount: Math.floor(rng(5, 500)),
  newEdges:     Math.floor(rng(0, 850)),
  workerID:     Math.floor(rng(0, 16)),
}));

// ── Benchmark comparison ──────────────────────────────────────
export const benchmarks = [
  { policy: 'Random',      coverage: 42.3, crashes: 28,  timeToFirst: 18420, execPerSec: 312, cpuEff: 0.58, memEff: 0.61 },
  { policy: 'RoundRobin',  coverage: 51.7, crashes: 41,  timeToFirst: 14100, execPerSec: 298, cpuEff: 0.63, memEff: 0.65 },
  { policy: 'UCB',         coverage: 73.4, crashes: 89,  timeToFirst:  8750, execPerSec: 445, cpuEff: 0.79, memEff: 0.74 },
  { policy: 'RL-DQN',      coverage: 81.2, crashes: 112, timeToFirst:  6230, execPerSec: 521, cpuEff: 0.84, memEff: 0.81 },
  { policy: 'PPO',         coverage: 86.7, crashes: 134, timeToFirst:  4890, execPerSec: 578, cpuEff: 0.89, memEff: 0.87 },
];

// ── AI Policy performance over time ──────────────────────────
export const policyTimeline = Array.from({ length: 100 }, (_, i) => ({
  epoch:      i + 1,
  UCB:        Math.min(90, 30 + i * 0.6 + rng(-2, 2, 2)),
  'RL-DQN':   Math.min(95, 25 + i * 0.7 + rng(-2, 3, 2)),
  PPO:        Math.min(97, 22 + i * 0.75 + rng(-1.5, 2.5, 2)),
  Random:     Math.min(55, 20 + i * 0.22 + rng(-1, 1, 2)),
  RoundRobin: Math.min(60, 22 + i * 0.28 + rng(-1, 1, 2)),
}));

// ── System health ─────────────────────────────────────────────
export const systemHealth = Array.from({ length: 288 }, (_, i) => ({
  timestamp:  format(subHours(new Date(), 24 - (i / 288) * 24), "HH:mm"),
  cpu:        rng(15, 95, 1),
  memory:     rng(20, 88, 1),
  disk:       rng(30, 70, 1),
  network:    rng(0.1, 8.5, 2),
  workers:    Math.floor(rng(4, 16)),
  queueDepth: Math.floor(rng(0, 2048)),
}));

// ── KPI Summary ───────────────────────────────────────────────
export const kpiSummary = {
  totalCoverage:     87.4,
  coverageDelta:     +5.2,
  uniqueCrashes:     134,
  crashDelta:        +12,
  totalExecutions:   482319,
  execDelta:         +8.7,
  avgRuntime:        2.34,
  runtimeDelta:      -0.18,
  memoryUsage:       3241,
  memDelta:          +142,
  aiDecisions:       192847,
  aiDelta:           +11.3,
  policyAccuracy:    91.2,
  accuracyDelta:     +2.1,
  coverageGain:      64.4,
  gainDelta:         +3.8,
  benchmarkSpeedup:  2.71,
  speedupDelta:      +0.14,
  activeSessions:    4,
  sessionDelta:      0,
  newEdgesPerHour:   1847,
  edgeDelta:         +231,
  uptime:            99.93,
};

// ── Crash distribution ────────────────────────────────────────
export const crashByType = [
  { name: 'use-after-free',      value: 41, color: '#EF4444' },
  { name: 'null-ptr-deref',      value: 28, color: '#F59E0B' },
  { name: 'heap-buffer-overflow',value: 22, color: '#8B5CF6' },
  { name: 'stack-overflow',      value: 14, color: '#3B82F6' },
  { name: 'soft-lockup',         value: 12, color: '#06B6D4' },
  { name: 'general-prot-fault',  value:  9, color: '#10B981' },
  { name: 'other',               value:  8, color: '#475569' },
];

export const crashBySubsystem = [
  { subsystem: 'net',    count: 38, severity: 'critical' },
  { subsystem: 'mm',     count: 31, severity: 'high'     },
  { subsystem: 'fs',     count: 24, severity: 'high'     },
  { subsystem: 'usb',    count: 16, severity: 'medium'   },
  { subsystem: 'gpu',    count: 11, severity: 'high'     },
  { subsystem: 'crypto', count:  8, severity: 'critical' },
  { subsystem: 'sound',  count:  6, severity: 'low'      },
];

// ── Heatmap (hours × days) ────────────────────────────────────
export const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day, hour,
    value: Math.floor(rng(0, 100)),
    label: `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]} ${String(hour).padStart(2,'0')}:00`,
  }))
).flat();

// ── Recent activity feed ──────────────────────────────────────
const activityTypes: string[] = ['crash_detected', 'policy_switch', 'coverage_milestone', 'worker_started', 'benchmark_complete', 'export_generated'];
export const recentActivity = Array.from({ length: 50 }, (_, i) => ({
  id:        `act-${i}`,
  timestamp: ts(i * 8),
  type:      pick(activityTypes),
  message:   (() => {
    const msgs: Record<string, string> = {
      crash_detected:       `KASAN crash detected in ${pick(subsystems)} subsystem`,
      policy_switch:        `Policy switched from ${pick(['Random','UCB'])} to ${pick(['RL-DQN','PPO'])}`,
      coverage_milestone:   `Coverage reached ${(60 + Math.floor(Math.random() * 30))}% milestone`,
      worker_started:       `Worker #${Math.floor(Math.random()*16)} started on CPU ${Math.floor(Math.random()*8)}`,
      benchmark_complete:   `Benchmark run completed – speedup: ${rng(1.5, 3.2, 2)}×`,
      export_generated:     `Report exported as ${pick(['PDF','CSV','JSON','Markdown'])}`,
    };
    return msgs[pick(activityTypes)];
  })(),
  severity: pick(['info', 'warning', 'error', 'success']),
}));
