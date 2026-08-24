import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Settings, User, ChevronDown,
  Zap, AlertCircle, CheckCircle2, X,
} from 'lucide-react';
import { cn, timeAgo } from '@/utils';
import { recentActivity } from '@/mock-data';

interface TopbarProps {
  sidebarWidth: number;
  breadcrumbs?: { label: string; active?: boolean }[];
}

const notifications = recentActivity.slice(0, 6) as Array<{
  id: string;
  severity: string;
  message: string;
  timestamp: string;
}>;

export function Topbar({ sidebarWidth, breadcrumbs = [] }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState('');

  const notifIcon = (sev: string) => {
    if (sev === 'error')   return <AlertCircle size={13} className="text-red-400" />;
    if (sev === 'success') return <CheckCircle2 size={13} className="text-emerald-400" />;
    if (sev === 'warning') return <AlertCircle size={13} className="text-amber-400" />;
    return <Zap size={13} className="text-blue-400" />;
  };

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 flex items-center px-5 gap-4 border-b border-vid-border/25"
      style={{
        left: sidebarWidth,
        background: 'rgba(7,11,20,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {breadcrumbs.map((bc, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-vid-dim text-xs">/</span>}
            <span className={cn(
              'text-sm',
              bc.active ? 'text-white font-semibold' : 'text-vid-subtext'
            )}>
              {bc.label}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className={cn(
        'relative flex items-center transition-all duration-300',
        searchFocused ? 'w-72' : 'w-52'
      )}>
        <Search size={14} className="absolute left-3 text-vid-dim" />
        <input
          type="text"
          placeholder="Search crashes, syscalls…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full bg-vid-surface/60 border border-vid-border/50 rounded-xl
                     pl-8 pr-3 py-2 text-xs text-vid-text placeholder:text-vid-dim
                     focus:outline-none focus:border-vid-blue/50 focus:bg-vid-card
                     transition-all duration-200 font-mono"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotif(v => !v)}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl
                     bg-vid-surface/60 border border-vid-border/40
                     text-vid-subtext hover:text-white hover:border-vid-blue/40
                     transition-all duration-200"
        >
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px]
                           font-bold rounded-full flex items-center justify-center">
            {notifications.filter(n => n.severity === 'error').length}
          </span>
        </button>

        <AnimatePresence>
          {showNotif && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 glass-card border-vid-border/40 overflow-hidden z-50"
              style={{ background: 'rgba(13,21,38,0.97)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-vid-border/30">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={() => setShowNotif(false)}>
                  <X size={13} className="text-vid-dim hover:text-white" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-hidden">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-3 px-4 py-3 border-b border-vid-border/20 hover:bg-vid-muted/20 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">{notifIcon(n.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-vid-text leading-snug">{n.message}</p>
                      <p className="text-[10px] text-vid-dim mt-0.5">{timeAgo(n.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-vid-blue hover:underline">View all activity</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings */}
      <button className="w-9 h-9 flex items-center justify-center rounded-xl
                         bg-vid-surface/60 border border-vid-border/40
                         text-vid-subtext hover:text-white hover:border-vid-blue/40
                         transition-all duration-200">
        <Settings size={15} />
      </button>

      {/* Kernel status pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl
                      bg-emerald-500/10 border border-emerald-500/20">
        <div className="status-dot online" />
        <span className="text-xs font-medium text-emerald-400">Kernel Online</span>
      </div>

      {/* Profile */}
      <button className="flex items-center gap-2 pl-3 border-l border-vid-border/30">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600
                        flex items-center justify-center text-white text-xs font-bold">
          DJ
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-white leading-tight">Devayani</p>
          <p className="text-[10px] text-vid-dim">Vis Engineer</p>
        </div>
        <ChevronDown size={12} className="text-vid-dim hidden md:block" />
      </button>
    </header>
  );
}
