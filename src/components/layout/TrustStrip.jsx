import { ExternalLink, Shield } from 'lucide-react';

/**
 * Zorvyn-inspired messaging strip. This app is a local demo and is not affiliated with Zorvyn.
 * @see https://www.zorvyn.io/about
 */
export function TrustStrip() {
  return (
    <div className="border-b border-slate-200/90 bg-gradient-to-r from-slate-50 via-sky-50/40 to-cyan-50/30 px-4 py-2.5 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-2 sm:items-center">
          <Shield
            className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400 sm:mt-0"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
            <span className="font-semibold text-slate-800 dark:text-white">
              Unified financial visibility
            </span>{' '}
            — inspired by how platforms like{' '}
            <a
              href="https://www.zorvyn.io/about"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sky-700 underline decoration-sky-300/70 underline-offset-2 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
            >
              Zorvyn
            </a>{' '}
            describe secure, compliant, and intelligent operations. This UI is a{' '}
            <span className="whitespace-nowrap rounded bg-white/80 px-1 py-0.5 font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              local mock demo
            </span>
            ; it is not a Zorvyn product and makes no certification claims.
          </p>
        </div>
        <a
          href="https://www.zorvyn.io/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-sky-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-white dark:border-sky-800/60 dark:bg-slate-800/90 dark:text-sky-200 dark:hover:border-sky-600 sm:self-center sm:text-sm"
        >
          About Zorvyn
          <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
        </a>
      </div>
    </div>
  );
}
