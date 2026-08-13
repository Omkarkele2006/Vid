import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell,
} from 'recharts';
import { Brain, TrendingUp, Zap, Target } from 'lucide-react';
import { KpiCard } from '@/components/cards/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { benchmarks, policyTimeline } from '@/mock-data';
import { policyColor } from '@/utils';

const ttStyle = { background:'rgba(13,21,38,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'0.625rem', fontSize:12, color:'#E2E8F0' };

const radarData = [
  { subject: 'Coverage',    UCB: 73, 'RL-DQN': 81, PPO: 87 },
  { subject: 'Speed',       UCB: 71, 'RL-DQN': 84, PPO: 92 },
  { subject: 'Efficiency',  UCB: 79, 'RL-DQN': 84, PPO: 89 },
  { subject: 'Crashes',     UCB: 66, 'RL-DQN': 84, PPO: 100 },
  { subject: 'Exploration', UCB: 88, 'RL-DQN': 77, PPO: 72 },
  { subject: 'Stability',   UCB: 91, 'RL-DQN': 82, PPO: 85 },
];

const policyEpochs = policyTimeline.filter((_, i) => i % 5 === 0);

export default function AIPolicyPerformance() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Policy <span className="text-gradient">Performance</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Adaptive intelligence engine · UCB, RL-DQN, PPO policy evaluation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Best Policy"       value={87}    format="percent" decimals={0} icon={Brain}     accent="purple" delta={14.3} deltaLabel="vs random" index={0} />
        <KpiCard title="Policy Accuracy"   value={91.2}  format="percent" decimals={1} icon={Target}    accent="blue"   delta={2.1}  deltaLabel="this week"  index={1} />
        <KpiCard title="AI Decisions"      value={192847} format="compact"             icon={Zap}       accent="cyan"   delta={11.3} deltaLabel="24h"         index={2} />
        <KpiCard title="Speedup vs Random" value={2.71}  format="decimal" decimals={2} unit="×" icon={TrendingUp} accent="green" delta={0.14} deltaLabel="24h" index={3} />
      </div>

      {/* Winner card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card gradient-border p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-cyan-500/5" />
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-glow-p">
              <Brain size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-vid-subtext uppercase tracking-widest mb-0.5">Winning Strategy</p>
              <p className="text-xl font-bold text-white">Proximal Policy Optimization <span className="text-gradient">(PPO)</span></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 ml-auto">
            {[
              { label: 'Coverage',    value: '86.7%' },
              { label: 'Crashes',     value: '134'   },
              { label: 'Time2First',  value: '4,890s' },
              { label: 'Exec/Sec',    value: '578'   },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-white font-mono">{value}</p>
                <p className="text-[10px] text-vid-subtext uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Multi-Metric Radar</p>
              <p className="text-xs text-vid-subtext mt-0.5">Top 3 policies compared across 6 dimensions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(36,51,82,0.7)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Radar name="UCB"    dataKey="UCB"    stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="RL-DQN" dataKey="RL-DQN" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="PPO"    dataKey="PPO"    stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} strokeWidth={2} />
              <Legend iconSize={10} formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 11 }}>{v}</span>} />
              <Tooltip contentStyle={ttStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Coverage over epochs */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Coverage Convergence</p>
              <p className="text-xs text-vid-subtext mt-0.5">All policies over 100 training epochs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={policyEpochs}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,51,82,0.5)" />
              <XAxis dataKey="epoch" tick={{ fontSize:10, fill:'#475569' }} label={{ value:'Epoch', position:'insideBottom', offset:-5, fill:'#475569', fontSize:10 }} />
              <YAxis tick={{ fontSize:10, fill:'#475569' }} domain={[0,100]} tickFormatter={v=>`${v}%`} width={38} />
              <Tooltip contentStyle={ttStyle} formatter={(v:number,n) => [`${v.toFixed(1)}%`, n]} />
              <Legend iconSize={10} formatter={(v) => <span style={{ color:'#94A3B8', fontSize:11 }}>{v}</span>} />
              {['UCB','RL-DQN','PPO','Random','RoundRobin'].map(p => (
                <Line key={p} type="monotone" dataKey={p} stroke={policyColor(p)} strokeWidth={p === 'PPO' ? 2.5 : 1.5}
                  dot={false} strokeDasharray={['Random','RoundRobin'].includes(p) ? '4 2' : undefined} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-vid-border/30">
          <p className="text-sm font-semibold text-white">Full Policy Benchmark Report</p>
          <p className="text-xs text-vid-subtext mt-0.5">Aggregate metrics across all evaluation experiments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full vid-table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Coverage %</th>
                <th>Unique Crashes</th>
                <th>Time-to-First (s)</th>
                <th>Exec/sec</th>
                <th>CPU Efficiency</th>
                <th>Mem Efficiency</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {[...benchmarks].sort((a, b) => b.coverage - a.coverage).map((b, i) => (
                <tr key={b.policy} className={i === 0 ? 'bg-purple-500/5' : ''}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: policyColor(b.policy) }} />
                      <span className="font-medium font-mono text-sm">{b.policy}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-vid-muted overflow-hidden w-16">
                        <div className="h-full rounded-full" style={{ width:`${b.coverage}%`, background: policyColor(b.policy) }} />
                      </div>
                      <span className="text-xs font-mono">{b.coverage}%</span>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{b.crashes}</td>
                  <td className="font-mono text-sm">{b.timeToFirst.toLocaleString()}</td>
                  <td className="font-mono text-sm">{b.execPerSec}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-14 rounded-full bg-vid-muted overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width:`${b.cpuEff*100}%` }} />
                      </div>
                      <span className="text-xs font-mono">{(b.cpuEff*100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-14 rounded-full bg-vid-muted overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width:`${b.memEff*100}%` }} />
                      </div>
                      <span className="text-xs font-mono">{(b.memEff*100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`text-sm font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-vid-dim'}`}>
                      #{i+1}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
