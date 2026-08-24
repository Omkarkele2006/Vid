import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Severity, ExecResult, ActivitySeverity } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, opts?: { compact?: boolean; decimals?: number }): string {
  if (opts?.compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toLocaleString('en-US', { maximumFractionDigits: opts?.decimals ?? 0 });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export function formatBytes(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(0)} MB`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function severityColor(s: Severity | string): string {
  const map: Record<string, string> = {
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    high:     'text-amber-400 bg-amber-400/10 border-amber-400/20',
    medium:   'text-blue-400 bg-blue-400/10 border-blue-400/20',
    low:      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };
  return map[s] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export function resultColor(r: ExecResult | string): string {
  const map: Record<string, string> = {
    success: 'text-emerald-400',
    crash:   'text-red-400',
    timeout: 'text-amber-400',
    skip:    'text-slate-400',
  };
  return map[r] ?? 'text-slate-400';
}

export function activityColor(s: ActivitySeverity): string {
  const map: Record<ActivitySeverity, string> = {
    info:    'bg-blue-500',
    warning: 'bg-amber-500',
    error:   'bg-red-500',
    success: 'bg-emerald-500',
  };
  return map[s];
}

export function policyColor(p: string): string {
  const map: Record<string, string> = {
    'UCB':        '#3B82F6',
    'RL-DQN':     '#8B5CF6',
    'PPO':        '#06B6D4',
    'Random':     '#F59E0B',
    'RoundRobin': '#10B981',
  };
  return map[p] ?? '#475569';
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function deltaSign(v: number): '+' | '' {
  return v > 0 ? '+' : '';
}

// ── Export utilities ──────────────────────────────────────────

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(v =>
      typeof v === 'string' && v.includes(',') ? `"${v}"` : v
    ).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printToPDF() {
  window.print();
}
