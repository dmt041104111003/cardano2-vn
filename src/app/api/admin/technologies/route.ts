import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createSuccessResponse, createErrorResponse } from "~/lib/api-response";

export const GET = withAdmin(async () => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(createSuccessResponse(technologies));
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const body = await req.json();
    console.log('Creating technology with data:', JSON.stringify(body, null, 2));
    
    const { title, name, description, href, image, githubRepo } = body;

    if (!title || !name || !description || !href) {
      return NextResponse.json(createErrorResponse('Missing required fields', 'MISSING_FIELDS'), { status: 400 });
    }

    const technology = await prisma.technology.create({
      data: {
        title,
        name,
        description,
        href,
        image,
        githubRepo: githubRepo || null,
      },
    });

    console.log('Technology created successfully:', technology.id);
    return NextResponse.json(createSuccessResponse(technology));
  } catch (error) {
    console.error('Error creating technology:', error);
    return NextResponse.json(createErrorResponse('Failed to create technology', 'CREATE_FAILED'), { status: 500 });
  }
}); 