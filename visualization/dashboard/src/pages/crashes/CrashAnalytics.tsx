import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, Bug, Clock, Shield } from 'lucide-react';
import { KpiCard } from '@/components/cards/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { crashes, crashByType, crashBySubsystem } from '@/mock-data';
import { cn, severityColor, timeAgo, formatDuration } from '@/utils';

const ttStyle = { background:'rgba(13,21,38,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'0.625rem', fontSize:12, color:'#E2E8F0' };

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#10B981',
};

export default function CrashAnalytics() {
  const [search, setSearch] = useState('');
  const [filterSev, setFilterSev] = useState<string>('all');
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const filtered = crashes.filter(c =>
    (filterSev === 'all' || c.severity === filterSev) &&
    (search === '' ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.subsystem.toLowerCase().includes(search.toLowerCase()) ||
      c.id.includes(search))
  );

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const bySeverity = ['critical','high','medium','low'].map(s => ({
    name: s, value: crashes.filter(c => c.severity === s).length, color: SEVERITY_COLORS[s],
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Crash <span className="text-gradient">Analytics</span></h1>
        <p className="text-sm text-vid-subtext mt-1">KASAN reports, kernel panics, and vulnerability analysis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Total Crashes"   value={crashes.length}                            icon={AlertTriangle} accent="red"    delta={12} deltaLabel="24h" index={0} />
        <KpiCard title="Critical"        value={bySeverity[0].value}                       icon={Bug}          accent="red"    index={1} />
        <KpiCard title="Reproduced"      value={crashes.filter(c => c.reproduced).length}  icon={Shield}       accent="green"  index={2} />
        <KpiCard title="Avg Time-to-First" value={Math.round(crashes.reduce((a,c)=>a+c.timeToFirst,0)/crashes.length)} unit="s" format="number" icon={Clock} accent="amber" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* By Type */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">By Vulnerability Type</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={crashByType} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {crashByType.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
              </Pie>
              <Tooltip contentStyle={ttStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {crashByType.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-vid-subtext">{d.name}</span>
                </div>
                <span className="text-xs font-mono text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Severity */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">By Severity</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bySeverity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10, fill:'#475569' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:'#94A3B8' }} width={60} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="value" name="Crashes" radius={[0,6,6,0]}>
                {bySeverity.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {bySeverity.map(s => (
              <div key={s.name as string} className={cn('px-3 py-2 rounded-lg border text-center', severityColor(s.name as string))}>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] capitalize">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* By Subsystem */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">By Kernel Subsystem</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={crashBySubsystem} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10, fill:'#475569' }} />
              <YAxis type="category" dataKey="subsystem" tick={{ fontSize:11, fill:'#94A3B8' }} width={45} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="count" name="Crashes" fill="#8B5CF6" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crash Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-vid-border/30">
          <div>
            <p className="text-sm font-semibold text-white">Crash Log</p>
            <p className="text-xs text-vid-subtext">{filtered.length} entries</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter */}
            <div className="flex gap-1">
              {['all','critical','high','medium','low'].map(s => (
                <button key={s}
                  onClick={() => { setFilterSev(s); setPage(0); }}
                  className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all border',
                    filterSev === s
                      ? 'border-vid-blue/50 bg-vid-blue/15 text-vid-blue'
                      : 'border-vid-border/40 text-vid-subtext hover:text-white'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Search */}
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="bg-vid-surface/60 border border-vid-border/40 rounded-xl px-3 py-1.5
                         text-xs text-vid-text placeholder:text-vid-dim font-mono
                         focus:outline-none focus:border-vid-blue/50 w-40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full vid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Subsystem</th>
                <th>Syscall</th>
                <th>Policy</th>
                <th>Reproduced</th>
                <th>Status</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c, i) => (
                <motion.tr key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td><span className="mono-badge">{c.id}</span></td>
                  <td><span className="text-xs truncate max-w-[180px] block">{c.type}</span></td>
                  <td>
                    <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-md border capitalize', severityColor(c.severity))}>
                      {c.severity}
                    </span>
                  </td>
                  <td><span className="mono-badge">{c.subsystem}</span></td>
                  <td><span className="mono-badge text-cyan-400">{c.syscall}</span></td>
                  <td><span className="mono-badge text-purple-400">{c.policyUsed}</span></td>
                  <td>
                    <span className={cn('text-xs font-medium', c.reproduced ? 'text-emerald-400' : 'text-vid-dim')}>
                      {c.reproduced ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td>
                    <span className={cn('text-xs capitalize', {
                      open:'text-red-400', triaged:'text-amber-400', fixed:'text-emerald-400',
                      duplicate:'text-slate-400', wontfix:'text-slate-500',
                    }[c.status])}>{c.status}</span>
                  </td>
                  <td><span className="text-xs text-vid-dim font-mono">{timeAgo(c.timestamp)}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-vid-border/30">
          <p className="text-xs text-vid-dim">
            Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p-1)}
              className="px-3 py-1 text-xs rounded-lg border border-vid-border/40 text-vid-subtext
                         hover:text-white hover:border-vid-blue/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i).map(i => (
              <button key={i} onClick={() => setPage(i)}
                className={cn('px-3 py-1 text-xs rounded-lg border transition-all',
                  page === i ? 'border-vid-blue/50 bg-vid-blue/15 text-vid-blue' : 'border-vid-border/40 text-vid-subtext hover:text-white'
                )}>{i+1}</button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p+1)}
              className="px-3 py-1 text-xs rounded-lg border border-vid-border/40 text-vid-subtext
                         hover:text-white hover:border-vid-blue/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
