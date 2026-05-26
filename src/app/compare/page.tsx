"use client";

import { useMemo, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/lib/utils';
import { apiFetcher } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSearchParams } from 'next/navigation';
interface SearchResponse {
  colleges: Array<{
    id: string;
    slug: string;
    name: string;
    location: string;
    imageUrl?: string;
    rating: number;
    fees: number;
  }>;
}

interface CompareResponse {
  colleges: Array<{
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    courses: Array<{ id: string; title: string }>;
    reviews: Array<unknown>;
  }>;
}

export default function ComparePage() {
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('compare-colleges', []);
  const searchParams = useSearchParams();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 350);
  const [expanded, setExpanded] = useState<string[]>([]);

  // If the page was opened with ?ids=..., populate local storage so the rest of the app reacts.
  useEffect(() => {
    const idsParam = searchParams?.get('ids') ?? '';
    if (idsParam) {
      const ids = idsParam.split(',').map((i) => i.trim()).filter(Boolean);
      if (ids.length) setCompareIds(ids);
    }
  // intentionally only respond to search params changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  const query = useMemo(() => (compareIds.length ? `/api/compare?ids=${compareIds.join(',')}` : null), [compareIds]);
  const { data, error, mutate } = useSWR<CompareResponse | null>(query, apiFetcher);

  const searchQuery = useMemo(() => {
    const base = `/api/colleges?limit=6`;
    if (debounced) {
      return `${base}&search=${encodeURIComponent(debounced)}`;
    }
    if (compareIds.length > 0 && compareIds.length < 3) {
      return base;
    }
    return null;
  }, [debounced, compareIds.length]);
  const { data: searchData } = useSWR<SearchResponse | null>(searchQuery, apiFetcher);

  const clearCompare = () => {
    setCompareIds([]);
    try { window.localStorage.removeItem('compare-colleges'); } catch {}
    mutate();
  };

  function addToCompare(id: string) {
    if (compareIds.includes(id)) return;
    if (compareIds.length >= 3) {
      toast.notify('You can compare up to 3 colleges.');
      return;
    }
    const next = [...compareIds, id];
    try { window.localStorage.setItem('compare-colleges', JSON.stringify(next)); } catch {}
    setCompareIds(next);
    toast.notify('Added to compare list.');
    mutate();
  }

  function removeFromCompare(id: string) {
    const next = compareIds.filter((i) => i !== id);
    try { window.localStorage.setItem('compare-colleges', JSON.stringify(next)); } catch {}
    setCompareIds(next);
    toast.notify('Removed from compare list.');
    mutate();
  }

  function comparePlacementLabel(college: CompareResponse['colleges'][0]) {
    const rating = college.rating;
    const reviewCount = college.reviews.length;
    if (rating >= 4.5 && reviewCount >= 4) return 'Excellent';
    if (rating >= 4.0) return 'Strong';
    if (rating >= 3.5) return 'Good';
    return 'Developing';
  }

  function generateInsights(colleges: CompareResponse['colleges']) {
    if (!colleges.length) return null;

    const lowestFee = Math.min(...colleges.map((college) => college.fees));
    const highestRating = Math.max(...colleges.map((college) => college.rating));
    const bestPlacementLabel = comparePlacementLabel(colleges.reduce((best, college) => {
      return comparePlacementLabel(college) === 'Excellent' ? college : best;
    }, colleges[0]));

    const cheapest = colleges.find((college) => college.fees === lowestFee);
    const topRated = colleges.find((college) => college.rating === highestRating);
    const bestPlacement = colleges.find((college) => comparePlacementLabel(college) === bestPlacementLabel) ?? colleges[0];

    return {
      cheapest: cheapest?.name ?? '',
      topRated: topRated?.name ?? '',
      bestPlacement: bestPlacement?.name ?? '',
      line1: cheapest && topRated ? `Best value: ${cheapest.name} has the lowest annual fees at ${formatCurrency(lowestFee)}.` : '',
      line2: topRated ? `Best rating: ${topRated.name} scored ${highestRating.toFixed(1)} ★, making it the strongest choice for academic reputation.` : '',
      line3: bestPlacement ? `Placement insight: ${bestPlacement.name} offers the strongest placement outlook with a ${comparePlacementLabel(bestPlacement)} placement rating.` : ''
    };
  }

  function toggleDetails(id: string) {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Compare Colleges</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Select up to three colleges and review fees, placements, location, and ratings side by side.</p>
        </div>
        <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <label className="text-sm text-slate-600 dark:text-slate-400">Find colleges to add</label>
              <div className="mt-3 flex gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, location or program"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
                <Button variant="outline" onClick={() => setSearch('')}>Clear</Button>
              </div>

              {searchData?.colleges?.length ? (
                <div className="mt-4 space-y-2">
                  {searchData.colleges
                    .filter((c) => !compareIds.includes(c.id))
                    .map((c) => (
                      <div key={c.id} className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-slate-50 dark:hover:bg-slate-900">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{c.location} · {c.rating.toFixed(1)} ★</p>
                        </div>
                        <div>
                          <Button variant="default" onClick={() => addToCompare(c.id)} disabled={compareIds.includes(c.id) || compareIds.length >= 3}>
                            {compareIds.includes(c.id) ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : debounced || compareIds.length > 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No colleges available to compare right now.</p>
              ) : null}
            </div>
          </div>

          <aside>
            <Card className="rounded-[2rem] border border-slate-200 p-5 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">Selected for compare</p>
              <div className="mt-3 space-y-3">
                {compareIds.length ? (
                  compareIds.map((id) => {
                    const collegeName = data?.colleges.find((college) => college.id === id)?.name ?? 'Selected college';
                    return (
                      <div key={id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-900 dark:text-white">{collegeName}</p>
                        <Button variant="outline" onClick={() => removeFromCompare(id)}>Remove</Button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No colleges selected</p>
                )}
              </div>
            </Card>
          </aside>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-200">
            Unable to load comparison data.
          </div>
        ) : !compareIds.length ? (
          <Card className="border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No colleges selected for comparison.</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Add colleges from the listings or detail pages to build your comparison list.</p>
          </Card>
        ) : !data ? (
          <div className="rounded-[2rem] bg-slate-100 p-10 text-center dark:bg-slate-900">
            Loading comparison view...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-400">Comparing {data.colleges.length} colleges.</p>
              <Button variant="outline" onClick={clearCompare}>Clear selection</Button>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-slate-600 dark:border-slate-800 dark:text-slate-400">Metric</th>
                    {data.colleges.map((college) => (
                      <th key={college.id} className="border-b border-slate-200 px-4 py-3 text-slate-900 dark:border-slate-800 dark:text-slate-200">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{college.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{college.location}</p>
                          </div>
                          <Button variant="outline" className="px-3 py-1 text-xs" onClick={() => removeFromCompare(college.id)}>Remove</Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Fees</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{formatCurrency(college.fees)}/yr</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Placements</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{comparePlacementLabel(college)}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Location</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{college.location}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Ratings</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{college.rating.toFixed(1)} ★</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Courses</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{college.courses.length}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">Review count</td>
                    {data.colleges.map((college) => (
                      <td key={college.id} className="px-4 py-4 text-slate-900 dark:text-slate-200">{college.reviews.length}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">AI Suggestions & Insights</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Based on the current comparison, here are the best picks and what to consider next.</p>
              <div className="mt-5 space-y-4">
                {(() => {
                  const insights = generateInsights(data.colleges);
                  if (!insights) return null;
                  return (
                    <>
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Best value</p>
                        <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{insights.line1}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Top pick for rating</p>
                        <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{insights.line2}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Placement insight</p>
                        <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{insights.line3}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="grid gap-4 overflow-x-auto md:grid-cols-3">
              {data.colleges.map((college) => (
                <Card key={college.id} className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950 dark:text-white">{college.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{college.location}</p>
                    </div>
                    <p className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">{college.rating.toFixed(1)} ★</p>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Fees</span>
                      <span>{formatCurrency(college.fees)}/yr</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Placement strength</span>
                      <span>{comparePlacementLabel(college)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Courses</span>
                      <span>{college.courses.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => removeFromCompare(college.id)}>Remove</Button>
                      <Button variant="ghost" onClick={() => toggleDetails(college.id)}>{expanded.includes(college.id) ? 'Hide details' : 'View details'}</Button>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{college.location}</div>
                  </div>

                  {expanded.includes(college.id) && (
                    <div className="mt-4 border-t pt-4 text-sm text-slate-700 dark:text-slate-300">
                      <p className="mb-3">{(college as any).description}</p>
                      <h4 className="text-sm font-semibold">All programs</h4>
                      <ul className="mt-2 space-y-1">
                        {college.courses.map((c) => (
                          <li key={c.id} className="text-sm">{c.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
