"use client";

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] px-4 py-20 text-center sm:px-6">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-rose-700 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-sm leading-7">An unexpected error occurred while loading this page. Please try again.</p>
        <button onClick={() => reset()} className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-rose-600 shadow-sm hover:bg-slate-50">
          Try again
        </button>
      </div>
    </div>
  );
}
