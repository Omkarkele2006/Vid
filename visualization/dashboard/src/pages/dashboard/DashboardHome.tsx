import { motion } from 'framer-motion';
import {
  BarChart2, AlertTriangle, Zap, Clock, Brain, Cpu,
  TrendingUp, Shield, Activity, Target, Server, Layers,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { KpiCard } from '@/components/cards/KpiCard';
import { Badge } from '@/components/ui/Badge';
import {
  kpiSummary, coverageTimeline, crashes, crashByType,
  benchmarks, recentActivity, systemHealth,
} from '@/mock-data';
import { cn, timeAgo, severityColor, activityColor } from '@/utils';

// Sampled data for charts (keep renders fast)
const coverageSample = coverageTimeline.filter((_, i) => i % 5 === 0).slice(-60);
const healthSample   = systemHealth.filter((_, i) => i % 4 === 0).slice(-36);

const CustomTooltipStyle = {
  background: 'rgba(13,21,38,0.97)',
  border: '1px solid rgba(59,130,246,0.2)',
  borderRadius: '0.625rem',
  padding: '10px 14px',
  fontSize: '12px',
  color: '#E2E8F0',
};

export default function DashboardHome() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="status-dot online" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Live Session</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kernel Intelligence{' '}
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-vid-subtext mt-1">
            VID · AI-Guided Adaptive Kernel Runtime Intelligence Framework
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="mono-badge">v1.0.0-cdac</span>
          <div className="px-3 py-1.5 rounded-xl bg-vid-blue/10 border border-vid-blue/20
                          text-xs text-vid-blue font-mono">
            Linux 6.6 · Syzkaller 2024.08
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <KpiCard title="Total Coverage"    value={kpiSummary.totalCoverage}   format="percent"  decimals={1} delta={kpiSummary.coverageDelta}  icon={Target}     accent="blue"   deltaLabel="vs yesterday" index={0} />
        <KpiCard title="Unique Crashes"    value={kpiSummary.uniqueCrashes}                     delta={kpiSummary.crashDelta}   icon={AlertTriangle} accent="red"    deltaLabel="24h"          index={1} />
        <KpiCard title="Total Executions"  value={kpiSummary.totalExecutions} format="compact"  delta={kpiSummary.execDelta}    icon={Zap}           accent="cyan"   deltaLabel="24h"          index={2} />
        <KpiCard title="Avg Runtime"       value={kpiSummary.avgRuntime}       format="decimal" decimals={2} unit="s" delta={kpiSummary.runtimeDelta} icon={Clock} accent="green"  deltaLabel="24h"          index={3} />
        <KpiCard title="AI Decisions"      value={kpiSummary.aiDecisions}     format="compact"  delta={kpiSummary.aiDelta}      icon={Brain}         accent="purple" deltaLabel="24h"          index={4} />
        <KpiCard title="Policy Accuracy"   value={kpiSummary.policyAccuracy}  format="percent"  decimals={1} delta={kpiSummary.accuracyDelta} icon={TrendingUp} accent="cyan"   deltaLabel="vs baseline" index={5} />
        <KpiCard title="Memory Usage"      value={kpiSummary.memoryUsage}     format="compact"  unit="MB"   delta={kpiSummary.memDelta}     icon={Server}        accent="amber"  deltaLabel="24h"          index={6} />
        <KpiCard title="Coverage Gain"     value={kpiSummary.coverageGain}    format="percent"  decimals={1} delta={kpiSummary.gainDelta}  icon={BarChart2}  accent="blue"   deltaLabel="over random"  index={7} />
        <KpiCard title="Benchmark Speedup" value={kpiSummary.benchmarkSpeedup} format="decimal" decimals={2} unit="×" delta={kpiSummary.speedupDelta} icon={Activity} accent="green"  deltaLabel="vs random"   index={8} />
        <KpiCard title="Active Sessions"   value={kpiSummary.activeSessions}                    delta={kpiSummary.sessionDelta} icon={Cpu}           accent="purple" deltaLabel=""            index={9} />
        <KpiCard title="New Edges/Hour"    value={kpiSummary.newEdgesPerHour} format="compact"  delta={kpiSummary.edgeDelta}    icon={Layers}        accent="cyan"   deltaLabel="24h"          index={10} />
        <KpiCard title="Uptime"            value={kpiSummary.uptime}          format="percent"  decimals={2}                    icon={Shield}        accent="green"  index={11} />
      </div>

      {/* ── Main Charts Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Coverage Growth */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Coverage Growth</p>
              <p className="text-xs text-vid-subtext mt-0.5">Kernel code coverage over 30-day session</p>
            </div>
            <Badge variant="blue">87.4% current</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coverageSample}>
              <defs>
                <linearGradient id="covGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#475569' }}
                tickFormatter={v => v.slice(5, 10)} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} domain={[15, 95]}
                tickFormatter={v => `${v}%`} width={35} />
              <Tooltip contentStyle={CustomTooltipStyle}
                formatter={(v: number) => [`${v.toFixed(1)}%`, 'Coverage']} />
              <Area type="monotone" dataKey="coverage" stroke="#3B82F6" strokeWidth={2}
                fill="url(#covGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crash Distribution Pie */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Crash Types</p>
              <p className="text-xs text-vid-subtext mt-0.5">By vulnerability category</p>
            </div>
            <Badge variant="red">{kpiSummary.uniqueCrashes} total</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={crashByType} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                paddingAngle={2} dataKey="value">
                {crashByType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={CustomTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {crashByType.slice(0, 4).map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] text-vid-subtext truncate max-w-[130px]">{d.name}</span>
                </div>
                <span className="text-[11px] font-mono text-vid-text">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Second Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Benchmark Bar */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Policy Benchmark Comparison</p>
              <p className="text-xs text-vid-subtext mt-0.5">Coverage achieved per AI strategy</p>
            </div>
            <Badge variant="purple">5 policies</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={benchmarks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} domain={[0, 100]}
                tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="policy" tick={{ fontSize: 11, fill: '#94A3B8' }} width={80} />
              <Tooltip contentStyle={CustomTooltipStyle}
                formatter={(v: number) => [`${v.toFixed(1)}%`, 'Coverage']} />
              <Bar dataKey="coverage" radius={[0, 6, 6, 0]}>
                {benchmarks.map((entry, i) => (
                  <Cell key={i} fill={
                    ['#F59E0B','#10B981','#3B82F6','#8B5CF6','#06B6D4'][i]
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System Health Sparklines */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">System Health</p>
              <p className="text-xs text-vid-subtext mt-0.5">Last 24 hours</p>
            </div>
            <div className="status-dot online" />
          </div>

          <div className="space-y-4">
            {[
              { label: 'CPU Usage',    key: 'cpu' as const,    color: '#3B82F6', value: 73 },
              { label: 'Memory',       key: 'memory' as const, color: '#8B5CF6', value: 62 },
              { label: 'Disk I/O',     key: 'disk' as const,   color: '#06B6D4', value: 48 },
            ].map(({ label, key, color, value }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-vid-subtext">{label}</span>
                  <span className="text-xs font-mono text-vid-text font-semibold">{value}%</span>
                </div>
                <ResponsiveContainer width="100%" height={36}>
                  <AreaChart data={healthSample}>
                    <defs>
                      <linearGradient id={`hg-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={key} stroke={color} strokeWidth={1.5}
                      fill={`url(#hg-${key})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="h-1 bg-vid-muted rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Crashes Table */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vid-border/30">
            <div>
              <p className="text-sm font-semibold text-white">Recent Crashes</p>
              <p className="text-xs text-vid-subtext mt-0.5">Latest KASAN / kernel panics</p>
            </div>
            <Badge variant="red">{crashes.length}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full vid-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Subsystem</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {crashes.slice(0, 6).map(c => (
                  <tr key={c.id}>
                    <td><span className="mono-badge">{c.id}</span></td>
                    <td className="max-w-[160px]">
                      <span className="text-xs truncate block text-vid-text">{c.type.split(':')[0]}</span>
                    </td>
                    <td>
                      <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-md border', severityColor(c.severity as string))}>
                        {c.severity}
                      </span>
                    </td>
                    <td><span className="mono-badge">{c.subsystem}</span></td>
                    <td>
                      <span className={cn('text-xs capitalize', {
                        open:      'text-red-400',
                        triaged:   'text-amber-400',
                        fixed:     'text-emerald-400',
                        duplicate: 'text-slate-400',
                        wontfix:   'text-slate-500',
                      }[c.status])}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-vid-border/30 text-center">
            <button className="text-xs text-vid-blue hover:underline">View all {crashes.length} crashes →</button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vid-border/30">
            <div>
              <p className="text-sm font-semibold text-white">Live Activity</p>
              <p className="text-xs text-vid-subtext mt-0.5">Real-time kernel fuzzing events</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="status-dot online" />
              <span className="text-xs text-emerald-400 font-mono">LIVE</span>
            </div>
          </div>
          <div className="divide-y divide-vid-border/20 max-h-[320px] overflow-y-auto scrollbar-hidden">
            {recentActivity.slice(0, 10).map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 px-5 py-3 hover:bg-vid-muted/20 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={cn('w-2 h-2 rounded-full', activityColor(act.severity as any))} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-vid-text leading-snug">{act.message}</p>
                  <p className="text-[10px] text-vid-dim mt-0.5 font-mono">{timeAgo(act.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
