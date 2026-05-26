import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { collegeSearchSchema } from '@/lib/validators';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = collegeSearchSchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid filter parameters' }, { status: 400 });
  }

  const { search, location, minFee, maxFee, rating, courseType, sort, page, limit } = parsed.data;
  const filters: Record<string, unknown> = {};

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (location) {
    filters.location = { equals: location, mode: 'insensitive' };
  }

  if (typeof minFee === 'number' || typeof maxFee === 'number') {
    filters.fees = {} as any;
    if (typeof minFee === 'number') (filters.fees as any).gte = minFee;
    if (typeof maxFee === 'number') (filters.fees as any).lte = maxFee;
  }

  if (typeof rating === 'number') {
    filters.rating = { gte: rating };
  }

  if (courseType) {
    filters.courses = { some: { type: courseType } };
  }

  const orderBy =
    sort === 'feesAsc'
      ? { fees: 'asc' as const }
      : sort === 'nameAsc'
      ? { name: 'asc' as const }
      : { rating: 'desc' as const };

  const total = await prisma.college.count({ where: filters });
  const colleges = await prisma.college.findMany({
    where: filters,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      slug: true,
      name: true,
      location: true,
      imageUrl: true,
      rating: true,
      fees: true,
      description: true
    }
  });

  return NextResponse.json({ total, page, limit, colleges });
}
