import Link from 'next/link';

const footerLinks = [
  { href: '/colleges', label: 'Colleges' },
  { href: '/compare', label: 'Compare' },
  { href: '/dashboard', label: 'Saved' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 px-4 py-10 text-slate-700 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">CollegeDiscover</p>
          <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            A friendly college search experience with compare tools, saved shortlists, and data-backed recommendations for every student.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand-600 dark:hover:text-brand-400">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Support</p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-slate-600 dark:text-slate-400">Need help choosing the right college? Reach out anytime for guidance.</p>
            <Link href="/auth/signin" className="transition hover:text-brand-600 dark:hover:text-brand-400">
              Sign in for personalized recommendations
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200/80 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} College Discovery Platform.</p>
          <p>Designed for modern college planning and confident decisions.</p>
        </div>
      </div>
    </footer>
  );
}
