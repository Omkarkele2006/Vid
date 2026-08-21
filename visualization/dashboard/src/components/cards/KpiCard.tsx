import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber, deltaSign } from '@/utils';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  accent?: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red';
  format?: 'number' | 'percent' | 'compact' | 'decimal';
  decimals?: number;
  className?: string;
  index?: number;
}

const accentConfig = {
  blue:   { bg: 'from-blue-500/10 to-blue-500/5',   icon: 'text-blue-400',   glow: 'shadow-blue-500/10',  border: 'border-blue-500/15' },
  purple: { bg: 'from-purple-500/10 to-purple-500/5', icon: 'text-purple-400', glow: 'shadow-purple-500/10', border: 'border-purple-500/15' },
  cyan:   { bg: 'from-cyan-500/10 to-cyan-500/5',   icon: 'text-cyan-400',   glow: 'shadow-cyan-500/10',  border: 'border-cyan-500/15' },
  green:  { bg: 'from-emerald-500/10 to-emerald-500/5', icon: 'text-emerald-400', glow: 'shadow-emerald-500/10', border: 'border-emerald-500/15' },
  amber:  { bg: 'from-amber-500/10 to-amber-500/5', icon: 'text-amber-400',  glow: 'shadow-amber-500/10', border: 'border-amber-500/15' },
  red:    { bg: 'from-red-500/10 to-red-500/5',     icon: 'text-red-400',    glow: 'shadow-red-500/10',   border: 'border-red-500/15' },
};

function useCountUp(target: number, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, decimals]);

  return count;
}

export function KpiCard({
  title, value, unit, delta, deltaLabel, icon: Icon,
  accent = 'blue', format = 'number', decimals = 0,
  className, index = 0,
}: KpiCardProps) {
  const a = accentConfig[accent];
  const animated = useCountUp(value, 1200, decimals);

  const displayValue = () => {
    if (format === 'percent') return `${animated.toFixed(decimals)}%`;
    if (format === 'decimal') return animated.toFixed(decimals);
    if (format === 'compact') return formatNumber(animated, { compact: true, decimals });
    return formatNumber(animated, { decimals });
  };

  const DeltaIcon = !delta ? Minus : delta > 0 ? TrendingUp : TrendingDown;
  const deltaClass = !delta ? 'text-slate-500' : delta > 0 ? 'text-emerald-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className={cn(
        'glass-card-hover relative overflow-hidden p-5 cursor-default',
        `border ${a.border}`,
        className
      )}
    >
      {/* Subtle gradient bg */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', a.bg)} />

      {/* Glow blob */}
      <div className={cn('absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 bg-gradient-radial', a.bg)} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-vid-subtext uppercase tracking-widest">{title}</p>
          <div className={cn('p-2 rounded-lg bg-vid-muted/60 backdrop-blur-sm', a.icon)}>
            <Icon size={15} strokeWidth={2} />
          </div>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-bold text-white font-tabular leading-none">{displayValue()}</span>
          {unit && <span className="text-sm text-vid-subtext font-medium">{unit}</span>}
        </div>

        {/* Delta */}
        {delta !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', deltaClass)}>
            <DeltaIcon size={12} strokeWidth={2.5} />
            <span>{deltaSign(delta)}{Math.abs(delta)}{unit === '%' ? 'pp' : '%'}</span>
            {deltaLabel && <span className="text-vid-dim ml-1 font-normal">{deltaLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
