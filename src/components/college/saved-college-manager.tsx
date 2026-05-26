'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface SavedCollege {
  id: string;
  college: {
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    slug: string;
  };
}

interface SavedCollegeManagerProps {
  saved: SavedCollege[];
}

export function SavedCollegeManager({ saved }: SavedCollegeManagerProps) {
  const [items, setItems] = useState(saved);
  const [removing, setRemoving] = useState<string | null>(null);
  const toast = useToast();

  async function handleRemove(collegeId: string) {
    setRemoving(collegeId);
    const response = await fetch(`/api/saved?collegeId=${collegeId}`, { method: 'DELETE' });

    if (!response.ok) {
      toast.notify('Unable to remove saved college.');
      setRemoving(null);
      return;
    }

    setItems(items.filter((item) => item.college.id !== collegeId));
    toast.notify('College removed from saved list.');
    setRemoving(null);
  }

  if (!items.length) {
    return (
      <Card className="rounded-[2rem] border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">No saved colleges yet.</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Save colleges while browsing to build a shortlist.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((entry) => (
        <Card key={entry.college.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/colleges/${entry.college.slug}`} className="group">
                  <p className="text-lg font-semibold text-slate-950 dark:text-white group-hover:underline">{entry.college.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.college.location}</p>
                </Link>
              </div>
              <Badge>{entry.college.location}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">{entry.college.rating.toFixed(1)} ★</Badge>
              <Badge>{formatCurrency(entry.college.fees)}/yr</Badge>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <Link href={`/colleges/${entry.college.slug}`} className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
                View details
              </Link>
              <Button variant="outline" onClick={() => handleRemove(entry.college.id)} disabled={removing === entry.college.id}>
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
