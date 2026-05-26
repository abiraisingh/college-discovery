import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] px-4 py-20 text-center sm:px-6">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">The college or page you are looking for doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Return home
        </Link>
      </div>
    </div>
  );
}
