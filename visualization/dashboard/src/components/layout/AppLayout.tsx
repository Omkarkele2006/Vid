import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const breadcrumbMap: Record<string, { label: string; active?: boolean }[]> = {
  '/':              [{ label: 'VID' }, { label: 'Dashboard', active: true }],
  '/coverage':      [{ label: 'VID' }, { label: 'Coverage Analytics', active: true }],
  '/crashes':       [{ label: 'VID' }, { label: 'Crash Analytics', active: true }],
  '/timeline':      [{ label: 'VID' }, { label: 'Execution Timeline', active: true }],
  '/benchmark':     [{ label: 'VID' }, { label: 'Benchmark Comparison', active: true }],
  '/ai-policy':     [{ label: 'VID' }, { label: 'AI Policy Performance', active: true }],
  '/system-health': [{ label: 'VID' }, { label: 'System Health', active: true }],
  '/reports':       [{ label: 'VID' }, { label: 'Experiment Reports', active: true }],
  '/architecture':  [{ label: 'VID' }, { label: 'Architecture Viewer', active: true }],
  '/settings':      [{ label: 'VID' }, { label: 'Settings', active: true }],
  '/about':         [{ label: 'VID' }, { label: 'About Project', active: true }],
};

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarWidth = collapsed ? 68 : 240;
  const breadcrumbs = breadcrumbMap[location.pathname] ?? [{ label: 'VID' }, { label: 'Page', active: true }];

  return (
    <div className="min-h-screen bg-vid-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <Topbar sidebarWidth={sidebarWidth} breadcrumbs={breadcrumbs} />

      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="pt-16 min-h-screen"
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-6"
        >
          <Outlet />
        </motion.div>
      </motion.main>
    </div>
  );
}
