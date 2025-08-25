import { NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(createSuccessResponse(courses));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  const { name, image, title, description, publishStatus } = await req.json();
  
  if (!name) {
    return NextResponse.json(createErrorResponse('Missing course name', 'MISSING_NAME'), { status: 400 });
  }
  
  const exist = await prisma.course.findFirst({ where: { name } });
  if (exist) {
    return NextResponse.json(createErrorResponse('Course already exists', 'COURSE_EXISTS'), { status: 409 });
  }
  
  const course = await prisma.course.create({
    data: { name, image, title, description, publishStatus }
  });
  
  return NextResponse.json(createSuccessResponse(course));
}); 