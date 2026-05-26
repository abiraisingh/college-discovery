import Link from 'next/link';
import { Button } from '@/components/ui/button';

const featureCards = [
  {
    title: 'Smart college search',
    description: 'Use advanced filters to discover colleges by fees, location, ratings and programs.',
  },
  {
    title: 'Compare side-by-side',
    description: 'Review fees, placement strength, student ratings and courses in a single view.',
  },
  {
    title: 'Save shortlist',
    description: 'Keep your favorite colleges handy and return to your top picks anytime.',
  },
];

const steps = [
  {
    title: 'Discover colleges',
    description: 'Search schools with curated data for fees, location, ratings and programs.',
  },
  {
    title: 'Choose the best fit',
    description: 'Compare colleges side-by-side to find the strongest option for your goals.',
  },
  {
    title: 'Save your shortlist',
    description: 'Bookmark colleges and create a personalized pathway to apply with confidence.',
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-brand-500/20 via-slate-50 to-transparent dark:from-brand-500/10 dark:via-slate-950 dark:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">College discovery made simple</div>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Find, compare, and save the best colleges for your career.</h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                  A student-focused platform for smarter college planning. Explore real programs, compare top schools, and save your strongest options in one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/colleges" className="w-full sm:w-auto">
                  <Button className="w-full justify-center sm:w-auto">Browse colleges</Button>
                </Link>
                <Link href="/compare" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full justify-center sm:w-auto">Compare colleges</Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full justify-center sm:w-auto">View your dashboard</Button>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/90 dark:ring-slate-700">
                  <p className="text-3xl font-semibold text-brand-600">60+</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Curated colleges</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/90 dark:ring-slate-700">
                  <p className="text-3xl font-semibold text-brand-600">1000+</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Student reviews</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/90 dark:ring-slate-700">
                  <p className="text-3xl font-semibold text-brand-600">24/7</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Instant insights</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Plan your next move</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">A smarter way to compare colleges.</h2>
                <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                  See the most important details at a glance, from fees and placement strength to reviews and course count.
                </p>
              </div>
              <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">1</span>
                  <div>
                    <p className="font-semibold">Quick search</p>
                    <p className="mt-1">Find colleges using location, fees, rating, and programs filters.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">2</span>
                  <div>
                    <p className="font-semibold">Side-by-side compare</p>
                    <p className="mt-1">Compare up to three colleges with one click.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">3</span>
                  <div>
                    <p className="font-semibold">Save favorites</p>
                    <p className="mt-1">Save the colleges you love and revisit your shortlist anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Why students choose us</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">College planning made faster, clearer, and more confident.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                We remove the guesswork from college research by combining official data, student feedback, and fast comparison tools into a single dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">{feature.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-600 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.28em] text-brand-100">Get started in minutes</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Turn your college search into a confident decision.</h2>
              <p className="max-w-2xl text-base leading-8 text-brand-100/90">
                Jump into the most useful college planning tools on the platform and start building a shortlist that fits your goals.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/colleges" className="w-full sm:w-auto">
                  <Button className="w-full justify-center sm:w-auto bg-white text-brand-600 hover:bg-slate-100">Browse colleges</Button>
                </Link>
                <Link href="/compare" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full justify-center sm:w-auto border-white text-white hover:border-brand-100 hover:text-brand-100">Compare now</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600">{index + 1}</div>
                      <div>
                        <p className="font-semibold">{step.title}</p>
                        <p className="mt-1 text-sm text-brand-100/80">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
