import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/cards/KpiCard';
import { Target, TrendingUp, Layers, Zap } from 'lucide-react';
import { coverageTimeline, policyTimeline, benchmarks } from '@/mock-data';

const sample = coverageTimeline.filter((_, i) => i % 4 === 0);
const policyColors: Record<string, string> = {
  UCB: '#3B82F6', 'RL-DQN': '#8B5CF6', PPO: '#06B6D4', Random: '#F59E0B', RoundRobin: '#10B981',
};
const ttStyle = { background:'rgba(13,21,38,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'0.625rem', fontSize:12, color:'#E2E8F0' };

export default function CoverageAnalytics() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Coverage <span className="text-gradient">Analytics</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Kernel code coverage tracking, edge discovery, and policy comparison</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Peak Coverage"   value={87.4}    format="percent" decimals={1} icon={Target}     accent="blue"   delta={5.2} deltaLabel="vs start"    index={0} />
        <KpiCard title="Total Edges"     value={142830}  format="compact"             icon={Layers}     accent="purple" delta={8.1} deltaLabel="24h"          index={1} />
        <KpiCard title="New Edges/Hour"  value={1847}    format="compact"             icon={TrendingUp} accent="cyan"   delta={231} deltaLabel="vs yesterday" index={2} />
        <KpiCard title="Programs Exec"   value={482319}  format="compact"             icon={Zap}        accent="green"  delta={8.7} deltaLabel="24h"          index={3} />
      </div>

      {/* Coverage Growth */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-white">Coverage Growth Over Time</p>
            <p className="text-xs text-vid-subtext mt-0.5">30-day kernel exploration progress</p>
          </div>
          <Badge variant="blue">87.4% peak</Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={sample}>
            <defs>
              <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
            <XAxis dataKey="timestamp" tick={{ fontSize:10, fill:'#475569' }} tickFormatter={v => v.slice(5,10)} />
            <YAxis tick={{ fontSize:10, fill:'#475569' }} domain={[0,100]} tickFormatter={v=>`${v}%`} width={38} />
            <Tooltip contentStyle={ttStyle} formatter={(v:number)=>[`${v.toFixed(1)}%`,'Coverage']} />
            <Area type="monotone" dataKey="coverage" stroke="#3B82F6" strokeWidth={2} fill="url(#cg1)" dot={false} activeDot={{ r:4, strokeWidth:0 }} name="Coverage %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Policy Comparison + New Edges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Policy Coverage Comparison</p>
              <p className="text-xs text-vid-subtext mt-0.5">All policies over training epochs</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            {Object.entries(policyColors).map(([p, c]) => (
              <button key={p}
                onClick={() => setActivePolicy(activePolicy === p ? null : p)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border"
                style={{
                  color: activePolicy === null || activePolicy === p ? '#fff' : '#475569',
                  borderColor: activePolicy === null || activePolicy === p ? c : 'rgba(36,51,82,0.5)',
                  background: activePolicy === null || activePolicy === p ? `${c}20` : 'transparent',
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                {p}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={policyTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
              <XAxis dataKey="epoch" tick={{ fontSize:10, fill:'#475569' }} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} domain={[0,100]} tickFormatter={v=>`${v}%`} width={38} />
              <Tooltip contentStyle={ttStyle} formatter={(v:number,n)=>[`${v.toFixed(1)}%`, n]} />
              {Object.entries(policyColors).map(([p, c]) => (
                <Line key={p} type="monotone" dataKey={p} stroke={c} strokeWidth={activePolicy === null || activePolicy === p ? 2 : 0.4}
                  dot={false} opacity={activePolicy === null || activePolicy === p ? 1 : 0.25} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">New Edge Discovery Rate</p>
              <p className="text-xs text-vid-subtext mt-0.5">Unique kernel paths per execution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sample.slice(0, 30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
              <XAxis dataKey="timestamp" tick={{ fontSize:10, fill:'#475569' }} tickFormatter={v => v.slice(5,10)} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} width={42} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="newEdges" name="New Edges" radius={[4,4,0,0]}>
                {sample.slice(0, 30).map((_, i) => (
                  <Cell key={i} fill={`rgba(59,130,246,${0.4 + (i/30)*0.6})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Coverage vs Executions scatter */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-white">Coverage vs Execution Count</p>
            <p className="text-xs text-vid-subtext mt-0.5">Correlation between runs and coverage gain per policy</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
            <XAxis dataKey="executions" name="Executions" type="number" tick={{ fontSize:10, fill:'#475569' }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <YAxis dataKey="coverage"   name="Coverage %"  type="number" tick={{ fontSize:10, fill:'#475569' }} domain={[0,100]} tickFormatter={v=>`${v}%`} width={38} />
            <Tooltip contentStyle={ttStyle} formatter={(v:number, n) => [n === 'executions' ? `${v.toLocaleString()}` : `${v.toFixed(1)}%`, n]} />
            <Scatter data={sample.slice(0, 80)} fill="#3B82F6" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
