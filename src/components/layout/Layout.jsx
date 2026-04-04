import PropTypes from 'prop-types';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrustStrip } from './TrustStrip';
import { ToastStack } from './ToastStack';
import { useFinanceStore } from '../../store/useFinanceStore';

/**
 * @param {Object} props
 * @param {boolean} props.dataReady Skeleton / delayed load flag
 */
export function Layout({ dataReady }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toasts = useFinanceStore((s) => s.toasts);
  const removeToast = useFinanceStore((s) => s.removeToast);

  return (
    <div className="flex min-h-screen bg-surface-light-muted dark:bg-surface-dark transition-theme duration-300">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Header onMenuOpen={() => setSidebarOpen(true)} />
        <TrustStrip />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl transition-opacity duration-300">
            <Outlet context={{ dataReady }} />
          </div>
        </main>
      </div>
      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

Layout.propTypes = {
  dataReady: PropTypes.bool.isRequired,
};
