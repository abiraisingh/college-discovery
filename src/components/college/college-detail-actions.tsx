"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

interface CollegeDetailActionsProps {
  collegeId: string;
  collegeSlug: string;
}

export function CollegeDetailActions({ collegeId, collegeSlug }: CollegeDetailActionsProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('compare-colleges', []);

  async function handleSave() {
    setLoading(true);
    const response = await fetch('/api/saved', {
      method: 'POST',
      body: JSON.stringify({ collegeId })
    });

    if (!response.ok) {
      toast.notify('Unable to save college. Please sign in or try again.');
      setLoading(false);
      return;
    }

    setSaved(true);
    toast.notify('College saved successfully.');
    setLoading(false);
  }

  async function handleCompare(e?: React.MouseEvent) {
    e?.preventDefault();
    try {
      const next = Array.from(new Set([...compareIds, collegeId]));
      // write to localStorage synchronously to ensure Compare page reads it immediately
      try {
        window.localStorage.setItem('compare-colleges', JSON.stringify(next));
      } catch {
        // ignore
      }
      setCompareIds(next);
      toast.notify('Added to compare list.');
      // debug log to verify click handler runs
      // eslint-disable-next-line no-console
      console.log('compare click:', next);
      // force navigation so client reads updated localStorage
      window.location.assign('/compare');
    } catch (err) {
      toast.notify('Unable to prepare compare list.');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleSave} disabled={loading}>
        {saved ? 'Saved' : 'Save college'}
      </Button>
      <Button variant="outline" onClick={handleCompare}>Compare</Button>
    </div>
  );
}
