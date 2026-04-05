import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrustStrip } from './TrustStrip';
import { ToastStack } from './ToastStack';
import { KeyboardHelpModal } from './KeyboardHelpModal';
import { useFinanceStore } from '../../store/useFinanceStore';

const PAGE_TITLE = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights',
  '/planning': 'Planning',
  '/pulse': 'Pulse',
};

/**
 * @param {Object} props
 * @param {boolean} props.dataReady Skeleton / delayed load flag
 */
export function Layout({ dataReady }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const toasts = useFinanceStore((s) => s.toasts);
  const removeToast = useFinanceStore((s) => s.removeToast);

  useEffect(() => {
    const label = PAGE_TITLE[location.pathname];
    document.title = label
      ? `${label} · Financial Console · Demo`
      : `Not found · Financial Console · Demo`;
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '?' && !(e.key === '/' && e.shiftKey)) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) {
        return;
      }
      if (t instanceof HTMLElement && t.isContentEditable) return;
      e.preventDefault();
      setShortcutsOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-light-muted dark:bg-surface-dark transition-theme duration-300">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Header
          onMenuOpen={() => setSidebarOpen(true)}
          onOpenKeyboardHelp={() => setShortcutsOpen(true)}
        />
        <TrustStrip />
        <main
          id="main-content"
          className="flex-1 px-4 py-6 lg:px-8 lg:py-8"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl transition-opacity duration-300">
            <Outlet context={{ dataReady }} />
          </div>
        </main>
      </div>
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      {shortcutsOpen ? (
        <KeyboardHelpModal onClose={() => setShortcutsOpen(false)} />
      ) : null}
    </div>
  );
}

Layout.propTypes = {
  dataReady: PropTypes.bool.isRequired,
};
