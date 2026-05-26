import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CollegeDetailActions } from '@/components/college/college-detail-actions';
import { formatCurrency } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollegeDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
      },
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <div className="pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
                {college.location}
              </p>

              <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
                {college.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {college.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                  {college.rating.toFixed(1)} ★ rating
                </div>

                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Established {college.established}
                </div>

                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {formatCurrency(college.fees)}/yr
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-950">
                <img
                  src={college.imageUrl}
                  alt={college.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <CollegeDetailActions
                collegeId={college.id}
                collegeSlug={college.slug}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Overview
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Programs
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    {college.courses.length} courses
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Placements
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    Strong industry links
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Courses offered
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {college.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </p>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {course.type} · {course.duration}
                    </p>

                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatCurrency(course.fees)} tuition
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Reviews
              </h2>

              <div className="mt-6 space-y-4">
                {college.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {review.title}
                        </p>

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          by {review.user.name ?? 'Anonymous'}
                        </p>
                      </div>

                      <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                        {review.rating} ★
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Fee structure
              </h2>

              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                  <span>Annual fees</span>
                  <span>{formatCurrency(college.fees)}</span>
                </div>

                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                  <span>Admission fee</span>
                  <span>
                    {formatCurrency(Math.round(college.fees * 0.1))}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                  <span>Average rating</span>
                  <span>{college.rating.toFixed(1)} ★</span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Gallery
              </h2>

              <div className="mt-5 grid gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={college.imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}