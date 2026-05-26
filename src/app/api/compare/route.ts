import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compareCollegeSchema } from '@/lib/validators';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = compareCollegeSchema.safeParse({ ids: url.searchParams.get('ids') ?? '' });

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const ids = parsed.data.ids.split(',').filter(Boolean).slice(0, 3);
  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: { courses: true, reviews: true }
  });

  return NextResponse.json({ colleges });
}
