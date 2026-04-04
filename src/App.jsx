import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { InsightsPage } from './pages/InsightsPage';
import { useFinanceStore } from './store/useFinanceStore';

/**
 * Root app: routes, simulated first-load delay, and `dark` class on the document element.
 */
export default function App() {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDataReady(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  return (
    <Routes>
      <Route element={<Layout dataReady={dataReady} />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Route>
    </Routes>
  );
}
