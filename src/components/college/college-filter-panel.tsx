'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CollegeFilters } from '@/types';

interface CollegeFilterPanelProps {
  filters: CollegeFilters;
  onChange: (filters: CollegeFilters) => void;
  onReset: () => void;
}

const locations = ['Bengaluru', 'Pune', 'Mumbai', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Coimbatore'];

export function CollegeFilterPanel({ filters, onChange, onReset }: CollegeFilterPanelProps) {
  const feeRange = useMemo(
    () => [filters.minFee ?? '', filters.maxFee ?? ''] as const,
    [filters.maxFee, filters.minFee]
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filters</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Refine results by location, fee, rating and course type.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Search colleges"
            value={filters.search ?? ''}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
          />
          <Select value={filters.location ?? ''} onChange={(event) => onChange({ ...filters, location: event.target.value || undefined })}>
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            type="number"
            placeholder="Min fees"
            value={feeRange[0]}
            onChange={(event) => onChange({ ...filters, minFee: event.target.value ? Number(event.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max fees"
            value={feeRange[1]}
            onChange={(event) => onChange({ ...filters, maxFee: event.target.value ? Number(event.target.value) : undefined })}
          />
          <Select value={filters.rating ? String(filters.rating) : ''} onChange={(event) => onChange({ ...filters, rating: event.target.value ? Number(event.target.value) : undefined })}>
            <option value="">Any rating</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}+ stars
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            value={filters.courseType ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                courseType: (event.target.value as 'UG' | 'PG' | 'DIPLOMA' | 'CERTIFICATION') || undefined
              })
            }
          >
            <option value="">Any course type</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="DIPLOMA">Diploma</option>
            <option value="CERTIFICATION">Certification</option>
          </Select>
          <div className="flex items-center gap-3">
            <Button type="button" variant="default" onClick={onReset} className="w-full">
              Reset filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
