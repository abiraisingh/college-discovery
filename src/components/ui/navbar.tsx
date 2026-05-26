"use client";

import Link from 'next/link';
import { useState } from 'react';
import { AuthMenu } from '@/components/ui/auth-menu';

const navLinks = [
  { href: '/colleges', label: 'Colleges' },
  { href: '/compare', label: 'Compare' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 transition-shadow duration-200 shadow-sm hover:shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-950 dark:text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white transform transition-transform duration-200 hover:scale-105">C</span>
          <span className="hidden sm:inline-block">CollegeDiscover</span>
        </Link>

        <div className="hidden items-center gap-3 text-sm text-slate-700 dark:text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative z-10 rounded-md px-3 py-2 text-slate-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-900/20 dark:hover:text-brand-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-slate-200/50 dark:bg-slate-700/40" />
          <AuthMenu />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <AuthMenu />
          </div>
        </div>
      ) : null}
    </header>
  );
}
