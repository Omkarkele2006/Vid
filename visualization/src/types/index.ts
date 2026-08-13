// ── Shared domain types ────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type CrashStatus = 'open' | 'triaged' | 'fixed' | 'duplicate' | 'wontfix';
export type PolicyName = 'UCB' | 'RL-DQN' | 'PPO' | 'Random' | 'RoundRobin';
export type ActivityType = 'crash_detected' | 'policy_switch' | 'coverage_milestone' | 'worker_started' | 'benchmark_complete' | 'export_generated';
export type ActivitySeverity = 'info' | 'warning' | 'error' | 'success';
export type ExecResult = 'success' | 'crash' | 'timeout' | 'skip';

export interface CoveragePoint {
  timestamp: string;
  coverage: number;
  edges: number;
  newEdges: number;
  executions: number;
  policy: PolicyName;
}

export interface Crash {
  id: string;
  timestamp: string;
  type: string;
  subsystem: string;
  severity: Severity;
  reproduced: boolean;
  timeToFirst: number;
  memAddr: string;
  syscall: string;
  stackDepth: number;
  program: string;
  status: CrashStatus;
  policyUsed: PolicyName;
}

export interface Execution {
  id: string;
  timestamp: string;
  duration: number;
  cpuUsage: number;
  memUsageMB: number;
  coverage: number;
  result: ExecResult;
  policy: PolicyName;
  syscallCount: number;
  newEdges: number;
  workerID: number;
}

export interface BenchmarkEntry {
  policy: PolicyName;
  coverage: number;
  crashes: number;
  timeToFirst: number;
  execPerSec: number;
  cpuEff: number;
  memEff: number;
}

export interface KpiSummary {
  totalCoverage: number;
  coverageDelta: number;
  uniqueCrashes: number;
  crashDelta: number;
  totalExecutions: number;
  execDelta: number;
  avgRuntime: number;
  runtimeDelta: number;
  memoryUsage: number;
  memDelta: number;
  aiDecisions: number;
  aiDelta: number;
  policyAccuracy: number;
  accuracyDelta: number;
  coverageGain: number;
  gainDelta: number;
  benchmarkSpeedup: number;
  speedupDelta: number;
  activeSessions: number;
  sessionDelta: number;
  newEdgesPerHour: number;
  edgeDelta: number;
  uptime: number;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: ActivityType;
  message: string;
  severity: ActivitySeverity;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}
