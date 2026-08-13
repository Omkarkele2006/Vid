import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/layout/AppLayout';

import DashboardHome from '@/pages/dashboard/DashboardHome';
import CoverageAnalytics from '@/pages/coverage/CoverageAnalytics';
import CrashAnalytics from '@/pages/crashes/CrashAnalytics';
import AIPolicyPerformance from '@/pages/ai-policy/AIPolicyPerformance';
import ArchitectureViewer from '@/pages/architecture/ArchitectureViewer';
import {
  ExecutionTimeline,
  SystemHealth,
  BenchmarkComparison,
  Reports,
  SettingsPage,
  About,
} from '@/pages/stubs';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13,21,38,0.97)',
            color: '#E2E8F0',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '0.75rem',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/coverage" element={<CoverageAnalytics />} />
          <Route path="/crashes" element={<CrashAnalytics />} />
          <Route path="/timeline" element={<ExecutionTimeline />} />
          <Route path="/benchmark" element={<BenchmarkComparison />} />
          <Route path="/ai-policy" element={<AIPolicyPerformance />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/architecture" element={<ArchitectureViewer />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
