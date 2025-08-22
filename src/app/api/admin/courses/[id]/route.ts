import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const body = await req.json();
  const { name, image, title, description } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existingCourse = await prisma.course.findFirst({
    where: {
      name,
      id: { not: id }
    }
  });

  if (existingCourse) {
    return NextResponse.json({ error: 'Course name already exists' }, { status: 400 });
  }

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      name,
      image,
      title,
      description
    }
  });

  return NextResponse.json(updatedCourse);
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.course.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}); 