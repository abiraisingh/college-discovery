import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.pathname.split('/').pop() ?? '';
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 8
      }
    }
  });

  if (!college) {
    return NextResponse.json({ message: 'College not found' }, { status: 404 });
  }

  const averageRating = college.reviews.length
    ? college.reviews.reduce((sum, item) => sum + item.rating, 0) / college.reviews.length
    : 0;

  return NextResponse.json({ ...college, averageRating });
}
