import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveCollegeSchema } from '@/lib/validators';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const saved = await prisma.savedCollege.findMany({
    where: { user: { email: session.user.email } },
    include: { college: { include: { courses: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ saved });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = saveCollegeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid college identifier' }, { status: 400 });
  }

  try {
    const saved = await prisma.savedCollege.create({
      data: {
        user: { connect: { email: session.user.email } },
        college: { connect: { id: parsed.data.collegeId } }
      }
    });

    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ message: 'Could not save college' }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const collegeId = url.searchParams.get('collegeId');
  if (!collegeId) {
    return NextResponse.json({ message: 'Missing college id' }, { status: 400 });
  }

  await prisma.savedCollege.deleteMany({
    where: {
      user: { email: session.user.email },
      collegeId
    }
  });

  return NextResponse.json({ success: true });
}
