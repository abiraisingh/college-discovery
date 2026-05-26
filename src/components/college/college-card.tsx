'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CollegeCardProps } from '@/types';

export function CollegeCard({ college, onSave, saved }: CollegeCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{college.name}</h3>
          <Badge>{college.location}</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">{college.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{college.rating.toFixed(1)} ★</Badge>
          <Badge>{formatCurrency(college.fees)}/yr</Badge>
        </div>
        <div className="flex flex-wrap gap-3 pt-3">
          <Link href={`/colleges/${college.slug}`} className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
            View details
          </Link>
          <Button variant={saved ? 'secondary' : 'outline'} onClick={onSave}>
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </article>
  );
}
