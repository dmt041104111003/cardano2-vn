import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const GET = withAdmin(async () => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { name, image, title, description } = await req.json();
  
  if (!name) {
    return NextResponse.json({ error: 'Missing course name' }, { status: 400 });
  }
  
  const exist = await prisma.course.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json({ error: 'Course already exists' }, { status: 409 });
  }
  
  const course = await prisma.course.create({
    data: { name, image, title, description }
  });
  
  return NextResponse.json({ course });
}); 