import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  cyan:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  amber:  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  red:    'bg-red-500/15 text-red-400 border-red-500/25',
  slate:  'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

export function Badge({ children, variant = 'blue', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-mono font-medium border rounded-md',
      size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
