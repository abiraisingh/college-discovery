import { CollegeBrowser } from '@/components/college/college-browser';

export default function CollegesPage() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 rounded-[2rem] bg-brand-600/10 p-10 text-slate-950 dark:bg-brand-500/10 dark:text-white">
          <h1 className="text-3xl font-semibold">College Listings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
            Search and filter colleges based on location, fee structure, rating, and degree type.
          </p>
        </div>
      </div>
      <CollegeBrowser />
    </div>
  );
}
