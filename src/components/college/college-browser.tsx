'use client';

import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiFetcher } from '@/api/client';
import { CollegeCard } from './college-card';
import { CollegeFilterPanel } from './college-filter-panel';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CollegeFilters, CollegeSummary } from '@/types';

interface CollegesResponse {
  total: number;
  page: number;
  limit: number;
  colleges: CollegeSummary[];
}

const initialFilters: CollegeFilters = {
  search: '',
  location: undefined,
  minFee: undefined,
  maxFee: undefined,
  rating: undefined,
  courseType: undefined,
  sort: 'ratingDesc',
  page: 1
};

function buildQuery(filters: CollegeFilters) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString();
}

export function CollegeBrowser() {
  const [filters, setFilters] = useState(initialFilters);
  const debouncedFilters = useDebouncedValue(filters, 400);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>('saved-colleges', []);

  const queryString = useMemo(() => buildQuery(debouncedFilters), [debouncedFilters]);
  const { data, error, isLoading, mutate } = useSWR<CollegesResponse>(
    `/api/colleges?${queryString}`,
    apiFetcher
  );

  const pageCount = data ? Math.ceil(data.total / (data.limit || 12)) : 0;

  const handleSave = useCallback(
    async (college: CollegeSummary) => {
      if (savedIds.includes(college.id)) {
        setSavedIds(savedIds.filter((id) => id !== college.id));
        return;
      }

      setSavedIds([...savedIds, college.id]);
      await fetch('/api/saved', {
        method: 'POST',
        body: JSON.stringify({ collegeId: college.id })
      });
    },
    [savedIds, setSavedIds]
  );

  const resetFilters = useCallback(() => setFilters(initialFilters), []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
        <CollegeFilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />

        <section className="space-y-6">
          <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">College results</p>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Discover programs that fit your ambitions</h2>
              </div>
              <Select
                value={filters.sort ?? 'ratingDesc'}
                onChange={(event) => setFilters({ ...filters, sort: event.target.value as any })}
              >
                <option value="ratingDesc">Highest rated</option>
                <option value="feesAsc">Lowest fees</option>
                <option value="nameAsc">Alphabetical</option>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
              Oops! We couldn&apos;t load colleges. Please refresh or try again.
            </div>
          ) : data?.colleges.length ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    saved={savedIds.includes(college.id)}
                    onSave={() => handleSave(college)}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-400">
                  Showing page {data.page} of {pageCount} — {data.total} results.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setFilters({ ...filters, page: Math.max(1, (filters.page ?? 1) - 1) })}
                    disabled={!data || data.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
                    disabled={!data || data.page >= pageCount}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No colleges found</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try updating filters or removing a search term.</p>
              <Button variant="default" onClick={resetFilters} className="mt-6">
                Reset filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
