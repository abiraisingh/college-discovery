import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { SavedCollegeManager } from '@/components/college/saved-college-manager';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.email) {
    redirect('/auth/signin');
  }

  const saved = await prisma.savedCollege.findMany({
    where: { user: { email: user.email } },
    include: {
      college: {
        select: { id: true, name: true, location: true, fees: true, rating: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Saved Colleges</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Manage college selections you have saved for later review.</p>
        </div>
        <SavedCollegeManager saved={saved} />
      </div>
    </div>
  );
}
