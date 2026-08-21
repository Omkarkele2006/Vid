import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';

const diagrams = [
  { id: 'system',   label: 'System Architecture' },
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'pipeline', label: 'Execution Pipeline' },
];

const blocks = [
  { id: 'kernel',   label: '1. Linux Kernel',       sub: 'Syscalls · KCOV · KASAN · Kernel Modules',  color: 'border-blue-500/40   bg-blue-500/8',   x: 0 },
  { id: 'syz',      label: '2. Syzkaller',           sub: 'Program Generation · Mutation · Execution',  color: 'border-indigo-500/40 bg-indigo-500/8', x: 1 },
  { id: 'feat',     label: '3. Feature Extraction',  sub: 'Coverage · Program · Temporal · Crash Feats',color: 'border-purple-500/40 bg-purple-500/8', x: 2 },
  { id: 'ai',       label: '4. Adaptive Policy Engine', sub: 'UCB · RL-DQN · PPO · Baseline Heuristics',color: 'border-cyan-500/40   bg-cyan-500/8',   x: 3 },
  { id: 'bench',    label: '5. Benchmark Engine',    sub: 'Coverage Analytics · Crash Analysis · Stats',color: 'border-green-500/40  bg-green-500/8',  x: 4 },
  { id: 'vis',      label: '6. Visualization Dashboard', sub: 'Live Graphs · Crash Timeline · Reports', color: 'border-amber-500/40  bg-amber-500/8',  x: 5, highlight: true },
  { id: 'exp',      label: '7. Experiment Manager',  sub: 'Config · Reproducible Runs · Results Storage', color: 'border-rose-500/40  bg-rose-500/8',  x: 6 },
];

const componentExplanations = [
  { title: 'Linux Kernel', desc: 'The target under test. Syscall interfaces are exercised by Syzkaller. KCOV instruments the kernel for coverage collection; KASAN detects memory safety violations in real time.' },
  { title: 'Syzkaller (Fuzzing Engine)', desc: 'Google\'s production-grade kernel fuzzer. Generates, mutates, and executes syscall programs. VID does NOT replace Syzkaller — it wraps around it and feeds better decisions to its scheduler.' },
  { title: 'Feature Extraction Engine', desc: 'Reads KCOV output and Syzkaller logs. Parses crash data (KASAN reports, OOPs, panics). Builds a rich feature vector: coverage features, program features, temporal features, and environment features.' },
  { title: 'Adaptive Policy Engine (Decision Maker)', desc: 'The AI brain of VID. Implements Contextual Bandit (UCB) for exploration/exploitation balance, optional RL policies (DQN, PPO), and baseline heuristics (Random, Round-Robin) for comparison. Selects next program and mutation strategy.' },
  { title: 'Benchmark & Analytics Engine', desc: 'Runs structured experiments, compares baseline vs adaptive policies, automates repeated executions, and generates reproducible statistical reports. Key output: coverage gain, time-to-first-crash, execution throughput.' },
  { title: 'Visualization Dashboard ← YOU ARE HERE', desc: 'This module. Provides real-time monitoring of all VID subsystems. Live coverage graphs, crash timelines, AI policy performance charts, system health monitoring, and professional PDF/CSV/JSON export.' },
  { title: 'Experiment Manager', desc: 'Manages the full experiment lifecycle: configuration, script automation, results storage (logs, metrics, artifacts), and reproducibility packaging for open-source publication.' },
];

export default function ArchitectureViewer() {
  const [selected, setSelected] = useState('system');
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Architecture <span className="text-gradient">Viewer</span></h1>
        <p className="text-sm text-vid-subtext mt-1">VID system components, data flows, and module dependencies</p>
      </div>

      {/* Diagram selector */}
      <div className="flex gap-2">
        {diagrams.map(d => (
          <button key={d.id}
            onClick={() => setSelected(d.id)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all border',
              selected === d.id
                ? 'bg-vid-blue/15 border-vid-blue/40 text-vid-blue'
                : 'bg-vid-surface/40 border-vid-border/40 text-vid-subtext hover:text-white'
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Architecture SVG Diagram */}
      <div className="glass-card p-6 overflow-x-auto">
        <p className="text-xs text-vid-subtext uppercase tracking-widest mb-5">System Architecture · VID Framework</p>

        {/* Custom architecture diagram */}
        <div className="min-w-[800px]">
          <div className="flex items-stretch gap-0">
            {blocks.map((block, i) => (
              <div key={block.id} className="flex items-center flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className={cn(
                    'flex-1 rounded-xl border p-3 cursor-pointer transition-all duration-200 relative',
                    block.color,
                    block.highlight && 'ring-1 ring-amber-500/40',
                    hoveredBlock === block.id && 'scale-105 shadow-lg z-10',
                  )}
                  style={{ minHeight: 120 }}
                >
                  {block.highlight && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Your Module
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-white leading-tight mb-1.5">{block.label}</p>
                  <p className="text-[9px] text-vid-subtext leading-relaxed">{block.sub}</p>
                </motion.div>
                {i < blocks.length - 1 && (
                  <div className="flex flex-col items-center flex-shrink-0 px-0.5">
                    <div className="h-px w-4 bg-gradient-to-r from-vid-blue/50 to-vid-purple/50" />
                    <ChevronRight size={10} className="text-vid-dim -mt-0.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Data flow labels */}
          <div className="flex mt-3 gap-0">
            {blocks.map((_, i) => (
              <div key={i} className="flex-1 text-center">
                {i < blocks.length - 1 && (
                  <p className="text-[8px] text-vid-dim leading-tight px-1">
                    {[
                      'Telemetry\n(Coverage, Crashes)',
                      'Program\nMetadata',
                      'Feature\nVector',
                      'Logs &\nRewards',
                      'Coverage\nData',
                      'Reports\n& Exports',
                    ][i]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-vid-border/30">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-px bg-vid-blue" />
            <ChevronRight size={9} className="text-vid-blue -ml-1" />
            <span className="text-[10px] text-vid-dim">Control Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-px bg-vid-purple border-dashed" style={{ borderTop: '1px dashed', background:'none' }} />
            <span className="text-[10px] text-vid-dim">Data Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm border border-amber-500/40 bg-amber-500/10" />
            <span className="text-[10px] text-vid-dim">Your Module (Visualization)</span>
          </div>
        </div>
      </div>

      {/* Component Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {componentExplanations.map((comp, i) => (
          <motion.div
            key={comp.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              'glass-card p-4',
              comp.title.includes('YOU ARE') && 'border-amber-500/25 bg-amber-500/5'
            )}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={cn(
                'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5',
                comp.title.includes('YOU ARE') ? 'bg-amber-500/20 text-amber-400' : 'bg-vid-blue/20 text-vid-blue'
              )}>
                {i + 1}
              </div>
              <p className="text-xs font-semibold text-white leading-tight">{comp.title}</p>
            </div>
            <p className="text-xs text-vid-subtext leading-relaxed">{comp.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Mermaid code block */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Mermaid Diagram Code</p>
          <Badge variant="cyan">Copy for draw.io / GitHub</Badge>
        </div>
        <pre className="text-[11px] font-mono text-vid-subtext overflow-x-auto scrollbar-hidden leading-relaxed p-4 bg-vid-bg/60 rounded-xl border border-vid-border/30">
{`graph LR
  K["🐧 Linux Kernel<br/>(Syscalls · KCOV · KASAN)"]
  S["⚙️ Syzkaller<br/>(Fuzzing Engine)"]
  F["🔍 Feature Extraction<br/>(Coverage · Crash · Temporal)"]
  A["🧠 Adaptive Policy Engine<br/>(UCB · RL-DQN · PPO)"]
  B["📊 Benchmark Engine<br/>(Analytics · Stats)"]
  V["📈 Visualization Dashboard<br/>(Charts · Reports · UI)"]
  E["🗂 Experiment Manager<br/>(Config · Storage · Repro)"]

  K -->|"Telemetry"| S
  S -->|"Program Metadata"| F
  F -->|"Feature Vector"| A
  A -->|"Logs & Rewards"| B
  B -->|"Coverage Data"| V
  V -->|"Reports"| E
  A -->|"Action"| S

  style V fill:#92400e,stroke:#f59e0b,color:#fff`}
        </pre>
      </div>
    </div>
  );
}
