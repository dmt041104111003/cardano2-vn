import {  NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      where: {
        publishStatus: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(createSuccessResponse(technologies));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
} 