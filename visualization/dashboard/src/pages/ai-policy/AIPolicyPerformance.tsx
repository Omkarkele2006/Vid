import { motion } from 'framer-motion';
import { Brain, TrendingUp, Zap, Target } from 'lucide-react';
import { KpiCard } from '@/components/cards/KpiCard';
import { policyV2Summary } from '@/mock-data';

export default function AIPolicyPerformance() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Policy <span className="text-gradient">Performance</span></h1>
        <p className="text-sm text-vid-subtext mt-1">Adaptive Policy V2 summary for the current Linux 7.1.8 run</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard title="Syscalls Analyzed" value={policyV2Summary.totalSyscalls} format="compact" icon={Brain} accent="purple" index={0} />
        <KpiCard title="V2 Score" value={policyV2Summary.averageScore} format="decimal" decimals={4} icon={Target} accent="blue" index={1} />
        <KpiCard title="High Priority" value={policyV2Summary.highPriority} icon={Zap} accent="cyan" index={2} />
        <KpiCard title="Low Priority" value={policyV2Summary.lowPriority} icon={TrendingUp} accent="green" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card gradient-border p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-cyan-500/5" />
        <div className="relative z-10 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Syscalls analyzed', policyV2Summary.totalSyscalls],
            ['High priority', policyV2Summary.highPriority],
            ['Medium priority', policyV2Summary.mediumPriority],
            ['Low priority', policyV2Summary.lowPriority],
            ['Average score', policyV2Summary.averageScore.toFixed(4)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-vid-border/30 bg-vid-muted/20 p-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-vid-subtext">{String(label)}</div>
              <div className="mt-2 text-xl font-bold text-white font-mono">{String(value)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="glass-card overflow-hidden p-5">
        <p className="text-sm font-semibold text-white">Current benchmark status</p>
        <p className="mt-2 text-sm text-vid-subtext">
          Comparative V1 vs V2 benchmark is not yet available.
        </p>
      </div>
    </div>
  );
}

