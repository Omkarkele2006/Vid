import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart2, AlertTriangle, Clock, Swords,
  Brain, Activity, FileText, GitBranch, Settings, Info,
  ChevronLeft, ChevronRight, Cpu, Shield,
} from 'lucide-react';
import { cn } from '@/utils';

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard',    path: '/',               icon: LayoutDashboard },
      { label: 'Coverage',     path: '/coverage',       icon: BarChart2       },
      { label: 'Crash Analytics', path: '/crashes',     icon: AlertTriangle, badge: 12 },
      { label: 'Timeline',     path: '/timeline',       icon: Clock           },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Benchmark',    path: '/benchmark',      icon: Swords          },
      { label: 'AI Policy',    path: '/ai-policy',      icon: Brain           },
      { label: 'System Health',path: '/system-health',  icon: Activity        },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Reports',      path: '/reports',        icon: FileText        },
      { label: 'Architecture', path: '/architecture',   icon: GitBranch       },
    ],
  },
  {
    label: 'Config',
    items: [
      { label: 'Settings',     path: '/settings',       icon: Settings        },
      { label: 'About VID',    path: '/about',          icon: Info            },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        background: 'rgba(7,11,20,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(59,130,246,0.1)',
      }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 flex-shrink-0 px-4 border-b border-vid-border/30',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-glow-b">
            <Shield size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-vid-bg" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="min-w-0"
            >
              <p className="text-sm font-bold text-white tracking-tight leading-none">VID</p>
              <p className="text-[10px] text-vid-subtext leading-tight mt-0.5 truncate">Kernel Intelligence</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden py-4 px-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold text-vid-dim uppercase tracking-widest px-3 mb-1"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map(({ label, path, icon: Icon, badge }) => {
                const isActive = path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(path);

                return (
                  <li key={path}>
                    <NavLink to={path}>
                      <div className={cn(
                        'nav-item',
                        isActive && 'active',
                        collapsed && 'justify-center px-2'
                      )}>
                        <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 truncate"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!collapsed && badge && (
                          <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {badge}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* System status mini widget */}
      <div className={cn('p-2 border-t border-vid-border/30', collapsed && 'flex justify-center')}>
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-3 m-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={13} className="text-vid-cyan" />
                <span className="text-[10px] font-semibold text-vid-subtext uppercase tracking-wider">System</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Kernel', value: 87, color: 'bg-blue-500' },
                  { label: 'Memory', value: 62, color: 'bg-purple-500' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] text-vid-dim mb-0.5">
                      <span>{label}</span><span>{value}%</span>
                    </div>
                    <div className="h-1 bg-vid-muted rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="status-dot online my-2" />
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-vid-card border border-vid-border
                   flex items-center justify-center text-vid-subtext hover:text-white hover:border-vid-blue
                   transition-all duration-200 shadow-card z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
