// Stub pages – complete implementations would follow the same patterns as the
// detailed pages above. Each renders a real page with charts and data.

import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { executions, systemHealth, benchmarks, coverageTimeline } from '@/mock-data';
import { KpiCard } from '@/components/cards/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Clock, Activity, FileText, Settings, Info, Cpu, HardDrive, Wifi, Server } from 'lucide-react';
import { resultColor, timeAgo, formatDuration, cn } from '@/utils';

const ttStyle = { background:'rgba(13,21,38,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'0.625rem', fontSize:12, color:'#E2E8F0' };

// ── Execution Timeline ─────────────────────────────────────────
export function ExecutionTimeline() {
  const sample = executions.slice(0, 200);
  const byResult = ['success','crash','timeout','skip'].map(r => ({
    name: r, value: sample.filter(e => e.result === r).length
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Execution <span className="text-gradient">Timeline</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Real-time execution logs across all Syzkaller workers</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Total Executions" value={executions.length} format="compact" icon={Clock}  accent="blue"   delta={8.7} deltaLabel="24h" index={0} />
        <KpiCard title="Success Rate"     value={Math.round(byResult[0].value/sample.length*100)} format="percent" icon={Clock} accent="green"  index={1} />
        <KpiCard title="Crash Rate"       value={Math.round(byResult[1].value/sample.length*100)} format="percent" icon={Clock} accent="red"    index={2} />
        <KpiCard title="Avg Duration"     value={parseFloat((executions.reduce((a,e)=>a+e.duration,0)/executions.length).toFixed(2))} format="decimal" decimals={2} unit="s" icon={Clock} accent="amber" index={3} />
      </div>

      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-white mb-4">Execution Duration Distribution</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={sample.slice(0,100)}>
            <defs>
              <linearGradient id="durGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
            <XAxis dataKey="id" tick={{ fontSize:10, fill:'#475569' }} tickFormatter={(_,i) => `#${i+1}`} />
            <YAxis tick={{ fontSize:10, fill:'#475569' }} tickFormatter={v=>`${v}s`} width={38} />
            <Tooltip contentStyle={ttStyle} formatter={(v:number)=>[`${v.toFixed(3)}s`,'Duration']} />
            <Area type="monotone" dataKey="duration" stroke="#06B6D4" fill="url(#durGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-vid-border/30">
          <p className="text-sm font-semibold text-white">Recent Executions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full vid-table">
            <thead><tr><th>ID</th><th>Duration</th><th>CPU%</th><th>Mem MB</th><th>Coverage</th><th>New Edges</th><th>Policy</th><th>Result</th><th>Worker</th></tr></thead>
            <tbody>
              {sample.slice(0,12).map(e => (
                <tr key={e.id}>
                  <td><span className="mono-badge">{e.id}</span></td>
                  <td className="font-mono text-xs">{e.duration.toFixed(3)}s</td>
                  <td className="font-mono text-xs">{e.cpuUsage.toFixed(1)}%</td>
                  <td className="font-mono text-xs">{e.memUsageMB.toFixed(0)}</td>
                  <td className="font-mono text-xs">{e.coverage.toFixed(1)}%</td>
                  <td className="font-mono text-xs">{e.newEdges}</td>
                  <td><span className="mono-badge text-purple-400">{e.policy}</span></td>
                  <td><span className={cn('text-xs capitalize font-medium', resultColor(e.result))}>{e.result}</span></td>
                  <td><span className="mono-badge">#{e.workerID}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── System Health ──────────────────────────────────────────────
export function SystemHealth() {
  const sample = systemHealth.filter((_,i) => i % 3 === 0);
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">System <span className="text-gradient">Health</span></h1>
        <p className="text-sm text-vid-subtext mt-1">CPU, memory, disk, and network telemetry over the last 24 hours</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="CPU Usage"      value={73}  format="percent" icon={Cpu}      accent="blue"   delta={-2.1} deltaLabel="vs avg" index={0} />
        <KpiCard title="Memory"         value={62}  format="percent" icon={Server}   accent="purple" delta={5.3}  deltaLabel="vs avg" index={1} />
        <KpiCard title="Disk I/O"       value={48}  format="percent" icon={HardDrive} accent="cyan"  delta={-1.2} deltaLabel="vs avg" index={2} />
        <KpiCard title="Network Mb/s"   value={4.7} format="decimal" decimals={1} unit="Mb/s" icon={Wifi} accent="green" delta={0.8} deltaLabel="24h avg" index={3} />
      </div>
      {[
        { key:'cpu' as const,     label:'CPU Usage',    color:'#3B82F6', stroke:'#3B82F6' },
        { key:'memory' as const,  label:'Memory',       color:'#8B5CF6', stroke:'#8B5CF6' },
        { key:'disk' as const,    label:'Disk I/O',     color:'#06B6D4', stroke:'#06B6D4' },
        { key:'network' as const, label:'Network Mb/s', color:'#10B981', stroke:'#10B981' },
      ].map(({ key, label, color, stroke }) => (
        <div key={key} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">{label}</p>
            <Badge variant="blue">24h</Badge>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={sample}>
              <defs>
                <linearGradient id={`sh-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.4)" />
              <XAxis dataKey="timestamp" tick={{ fontSize:10, fill:'#475569' }} interval={8} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} width={32} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey={key} stroke={stroke} fill={`url(#sh-${key})`} strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

// ── Benchmark Comparison ───────────────────────────────────────
export function BenchmarkComparison() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Benchmark <span className="text-gradient">Comparison</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Adaptive AI vs baseline scheduling heuristics</p>
      </div>
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-white mb-4">Coverage by Policy</p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={benchmarks}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
            <XAxis dataKey="policy" tick={{ fontSize:11, fill:'#94A3B8' }} />
            <YAxis tick={{ fontSize:10, fill:'#475569' }} tickFormatter={v=>`${v}%`} width={38} />
            <Tooltip contentStyle={ttStyle} />
            <Legend />
            <Bar dataKey="coverage" name="Coverage %" radius={[6,6,0,0]}>
              {benchmarks.map((_, i) => (
                <Cell key={i} fill={['#F59E0B','#10B981','#3B82F6','#8B5CF6','#06B6D4'][i]} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="cpuEff" name="CPU Efficiency" stroke="#E2E8F0" strokeWidth={2} dot={{ r: 4 }} yAxisId={0} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Reports ────────────────────────────────────────────────────
export function Reports() {
  const reportTypes = [
    { label: 'PDF Report',          ext: 'PDF',      desc: 'Full experiment summary with charts and analysis', color: 'text-red-400' },
    { label: 'Markdown Export',     ext: 'MD',       desc: 'GitHub-ready technical documentation',             color: 'text-blue-400' },
    { label: 'CSV Export',          ext: 'CSV',      desc: 'Raw execution and crash data for analysis',        color: 'text-green-400' },
    { label: 'JSON Export',         ext: 'JSON',     desc: 'Structured data with full metadata',               color: 'text-yellow-400' },
    { label: 'Coverage Summary',    ext: 'REPORT',   desc: 'Coverage metrics and edge discovery statistics',   color: 'text-purple-400' },
    { label: 'Crash Summary',       ext: 'REPORT',   desc: 'Vulnerability analysis and triage status',         color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Experiment <span className="text-gradient">Reports</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Generate and export VID experiment summaries in multiple formats</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div key={r.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="glass-card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <span className={`mono-badge ${r.color} border-current/30`}>.{r.ext}</span>
            </div>
            <p className="text-sm font-semibold text-white mb-1.5">{r.label}</p>
            <p className="text-xs text-vid-subtext mb-4">{r.desc}</p>
            <button className="w-full py-2 rounded-xl bg-vid-blue/15 border border-vid-blue/30 text-vid-blue text-xs font-semibold hover:bg-vid-blue/25 transition-all">
              Generate Report
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────
export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-2xl font-bold text-white"><span className="text-gradient">Settings</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Configure VID dashboard preferences</p>
      </div>
      {[
        { label: 'Display', items: ['Dark Mode', 'Compact View', 'Animations'] },
        { label: 'Data', items: ['Refresh Interval', 'Data Retention', 'Export Format'] },
        { label: 'Notifications', items: ['Crash Alerts', 'Coverage Milestones', 'Policy Switches'] },
      ].map(group => (
        <div key={group.label} className="glass-card p-5">
          <p className="text-xs font-semibold text-vid-subtext uppercase tracking-widest mb-4">{group.label}</p>
          <div className="space-y-3">
            {group.items.map(item => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-vid-border/20 last:border-0">
                <span className="text-sm text-vid-text">{item}</span>
                <div className="w-10 h-5 rounded-full bg-vid-blue relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── About ──────────────────────────────────────────────────────
export function About() {
  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-2xl font-bold text-white">About <span className="text-gradient">VID</span></h1>
        <p className="text-sm text-vid-subtext mt-1">AI-Guided Adaptive Kernel Runtime Intelligence Framework</p>
      </div>
      <div className="glass-card gradient-border p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <div>
            <p className="text-xl font-bold text-white">VID</p>
            <p className="text-sm text-vid-subtext">National Level SSM Hackathon 2026 · CDAC</p>
            <p className="text-xs text-vid-dim mt-0.5">Team: Open Thinkers · August 2026</p>
          </div>
        </div>
        <p className="text-sm text-vid-subtext leading-relaxed mb-4">
          VID is an AI-powered Linux kernel fuzzing framework that sits on top of Syzkaller and 
          intelligently guides kernel fuzzing using an adaptive AI policy engine. Rather than replacing 
          existing infrastructure, VID enhances it through intelligent decision-making, modular design, 
          and reproducible experimentation.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Om Karkele',      role: 'Core Infrastructure & AI Engine' },
            { name: 'Yash Kashid',     role: 'Feature Extraction & Benchmark Engine' },
            { name: 'Devayani Jadhav', role: 'Visualization & Reporting Module' },
          ].map(m => (
            <div key={m.name} className="p-3 bg-vid-muted/30 rounded-xl border border-vid-border/30">
              <p className="text-sm font-semibold text-white">{m.name}</p>
              <p className="text-xs text-vid-subtext mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-5">
        <p className="text-xs text-vid-subtext uppercase tracking-widest mb-3">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {['React 18','TypeScript','Tailwind CSS','Framer Motion','Recharts','Vite','Next.js','Lucide Icons'].map(t => (
            <span key={t} className="mono-badge">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
