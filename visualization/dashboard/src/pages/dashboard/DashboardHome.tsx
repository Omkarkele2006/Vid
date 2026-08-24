import { motion } from 'framer-motion';
import {
  BarChart2, AlertTriangle, Zap, Clock, Brain, Cpu,
  TrendingUp, Shield, Activity, Target, Server, Layers,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { KpiCard } from '@/components/cards/KpiCard';
import { Badge } from '@/components/ui/Badge';
import {
  kpiSummary, coverageTimeline, crashes, crashByType,
  policyV2Summary,
} from '@/mock-data';
import { cn } from '@/utils';

const coverageSample = coverageTimeline.filter((_, i) => i % 5 === 0);

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
            Linux 7.1.8 · Syzkaller
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <KpiCard title="Normalized Coverage" value={kpiSummary.totalCoverage} format="percent" decimals={1} icon={Target} accent="blue" index={0} />
        <KpiCard title="Unique Crashes" value={kpiSummary.uniqueCrashes} icon={AlertTriangle} accent="red" index={1} />
        <KpiCard title="Total Executions" value={kpiSummary.totalExecutions} format="compact" icon={Zap} accent="cyan" index={2} />
        <KpiCard title="Avg Runtime" value={kpiSummary.avgRuntime} format="decimal" decimals={2} unit="s" icon={Clock} accent="green" index={3} />
        <KpiCard title="AI Decisions" value={policyV2Summary.totalSyscalls} format="compact" icon={Brain} accent="purple" index={4} />
        <KpiCard title="V2 Policy Score" value={policyV2Summary.averageScore} format="decimal" decimals={4} icon={TrendingUp} accent="cyan" index={5} />
        <KpiCard title="High Priority" value={policyV2Summary.highPriority} icon={BarChart2} accent="blue" index={6} />
        <KpiCard title="Medium Priority" value={policyV2Summary.mediumPriority} icon={Activity} accent="green" index={7} />
        <KpiCard title="Low Priority" value={policyV2Summary.lowPriority} icon={Cpu} accent="purple" index={8} />
        <KpiCard title="Telemetry Events" value={3584} format="compact" icon={Layers} accent="cyan" index={9} />
        <KpiCard title="Syscall Observations" value={6405} format="compact" icon={Server} accent="amber" index={10} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Coverage Progress</p>
              <p className="text-xs text-vid-subtext mt-0.5">KCOV edge coverage normalized to the maximum observed value in this run</p>
            </div>
            <Badge variant="blue">{kpiSummary.totalCoverage.toFixed(1)}% current</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coverageSample}>
              <defs>
                <linearGradient id="covGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={v => v.slice(5, 10)} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} domain={[0, 100]} tickFormatter={v => `${v}%`} width={35} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Coverage']} />
              <Area type="monotone" dataKey="coverage" stroke="#3B82F6" strokeWidth={2} fill="url(#covGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Crash Types</p>
              <p className="text-xs text-vid-subtext mt-0.5">Current kernel run</p>
            </div>
            <Badge variant="red">{crashes.length}</Badge>
          </div>

          {crashes.length === 0 ? (
            <div className="flex h-[170px] flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-white">No crashes detected</p>
              <p className="mt-2 max-w-[220px] text-xs leading-5 text-vid-subtext">
                Current Linux 7.1.8 run recorded zero crash events.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {crashByType.map((entry, index) => (
                <div key={`${entry.name}-${index}`} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
                    <span className="text-vid-subtext">{entry.name}</span>
                  </div>
                  <span className="font-mono text-vid-text">{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-white">Adaptive Policy V2</p>
              <p className="text-xs text-vid-subtext mt-0.5">Current run summary</p>
            </div>
            <Badge variant="purple">{policyV2Summary.totalSyscalls} analyzed</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Syscalls analyzed', value: policyV2Summary.totalSyscalls },
              { label: 'High priority', value: policyV2Summary.highPriority },
              { label: 'Medium priority', value: policyV2Summary.mediumPriority },
              { label: 'Low priority', value: policyV2Summary.lowPriority },
              { label: 'Average policy score', value: policyV2Summary.averageScore.toFixed(4) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-vid-border/30 bg-vid-muted/20 p-3">
                <div className="text-[10px] uppercase tracking-[0.14em] text-vid-subtext">{item.label}</div>
                <div className="mt-2 text-xl font-bold text-white font-mono">{item.value}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-vid-subtext">
            Comparative V1 vs V2 benchmark is not yet available.
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Telemetry Status</p>
              <p className="text-xs text-vid-subtext mt-0.5">System health snapshot</p>
            </div>
            <div className="status-dot online" />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-vid-border/20 pb-2"><span className="text-vid-subtext">Kernel</span><span className="font-mono text-emerald-400">ONLINE</span></div>
            <div className="flex items-center justify-between border-b border-vid-border/20 pb-2"><span className="text-vid-subtext">Kernel Version</span><span className="font-mono text-white">7.1.8</span></div>
            <div className="flex items-center justify-between border-b border-vid-border/20 pb-2"><span className="text-vid-subtext">Execution Events</span><span className="font-mono text-white">3,584</span></div>
            <div className="flex items-center justify-between border-b border-vid-border/20 pb-2"><span className="text-vid-subtext">Syscall Observations</span><span className="font-mono text-white">6,405</span></div>
            <div className="flex items-center justify-between"><span className="text-vid-subtext">Kernel Crashes</span><span className="font-mono text-white">0</span></div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-vid-subtext">
            CPU, memory and disk utilization are not available in the current telemetry dataset.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vid-border/30">
            <div>
              <p className="text-sm font-semibold text-white">Recent Crashes</p>
              <p className="text-xs text-vid-subtext mt-0.5">Latest kernel events</p>
            </div>
            <Badge variant="red">{crashes.length}</Badge>
          </div>

          <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
            <p className="text-lg font-semibold text-white">No crashes detected</p>
            <p className="mt-2 max-w-[260px] text-xs leading-5 text-vid-subtext">
              Current Linux 7.1.8 run recorded zero crash events.
            </p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-vid-border/30">
            <div>
              <p className="text-sm font-semibold text-white">Telemetry Summary</p>
              <p className="text-xs text-vid-subtext mt-0.5">Current dataset overview</p>
            </div>
            <div className="status-dot online" />
          </div>

          <div className="divide-y divide-vid-border/20">
            {[
              ['Execution events', '3,584'],
              ['Syscall observations', '6,405'],
              ['Syscalls analyzed by V2', '296'],
              ['Kernel crashes', '0'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-vid-subtext">{label}</span>
                <span className="font-mono text-sm text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
