import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  const body = await req.json();
  const { name, image, title, description, publishStatus } = body;

  if (!name) {
    return NextResponse.json(createErrorResponse('Name is required', 'MISSING_NAME'), { status: 400 });
  }

  const existingCourse = await prisma.course.findFirst({
    where: {
      name,
      id: { not: id }
    }
  });

  if (existingCourse) {
    return NextResponse.json(createErrorResponse('Course name already exists', 'COURSE_NAME_ALREADY_EXISTS'), { status: 400 });
  }

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      name,
      image,
      title,
      description,
      publishStatus
    }
  });

  return NextResponse.json(createSuccessResponse(updatedCourse));
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.course.delete({
    where: { id }
  });

  return NextResponse.json(createSuccessResponse({ success: true }));
}); 