'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CollegeSummary } from '@/types';

interface CompareBarProps {
  colleges: CollegeSummary[];
  onClear: () => void;
}

export function CompareBar({ colleges, onClear }: CompareBarProps) {
  if (!colleges.length) return null;

  return (
    <div className="sticky bottom-0 z-30 mx-auto mb-4 max-w-7xl rounded-[2rem] border border-slate-200 bg-white/95 px-5 py-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {colleges.map((college) => (
            <div key={college.id} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {college.name}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClear}>
            Clear all
          </Button>
          <Link href={`/compare?ids=${colleges.map((college) => college.id).join(',')}`}>
            <Button variant="default">Compare {colleges.length}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
