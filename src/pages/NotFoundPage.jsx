import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

/**
 * Friendly 404 for unknown routes.
 */
export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
      <p className="text-6xl font-black tabular-nums text-slate-200 dark:text-slate-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">This view does not exist</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        The URL may be mistyped, or the demo only ships a handful of routes. Head back to the console home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-sky-500 hover:to-cyan-500"
        >
          <Home className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-500/40"
        >
          <Search className="h-4 w-4" aria-hidden />
          Browse transactions
        </Link>
      </div>
    </div>
  );
}
