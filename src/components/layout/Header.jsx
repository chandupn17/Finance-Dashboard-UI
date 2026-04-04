import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

/**
 * @param {Object} props
 * @param {() => void} props.onMenuOpen Open sidebar (mobile)
 */
export function Header({ onMenuOpen }) {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode);
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md transition-theme dark:border-slate-700 dark:bg-surface-dark-muted/90 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Financial Console
          </h1>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            Secure visibility into spending, income, and insights (demo)
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-amber-200 dark:hover:border-sky-500/40 dark:hover:bg-slate-700"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-sky-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-500/50"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
          >
            Role: <span className="capitalize text-sky-700 dark:text-sky-300">{role}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
          </button>
          {menuOpen ? (
            <ul
              className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800"
              role="listbox"
            >
              {(['viewer', 'admin']).map((r) => (
                <li key={r} role="option" aria-selected={role === r}>
                  <button
                    type="button"
                    className={`w-full px-4 py-2 text-left text-sm capitalize transition hover:bg-sky-50 dark:hover:bg-slate-700 ${
                      role === r ? 'font-semibold text-sky-700 dark:text-sky-300' : ''
                    }`}
                    onClick={() => {
                      setRole(/** @type {'admin' | 'viewer'} */ (r));
                      setMenuOpen(false);
                    }}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onMenuOpen: PropTypes.func.isRequired,
};
