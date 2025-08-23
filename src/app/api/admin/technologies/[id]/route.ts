import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createErrorResponse, createSuccessResponse } from "~/lib/api-response";

export async function GET(
  { params }: { params: { id: string } }
) {
  try {
    const technology = await prisma.technology.findUnique({
      where: { id: params.id }
    });

    if (!technology) {
      return NextResponse.json(createErrorResponse('Technology not found', 'TECHNOLOGY_NOT_FOUND'), { status: 404 });
    }

    return NextResponse.json(createSuccessResponse(technology));
  } catch (error) {
    console.error('Error fetching technology:', error);
    return NextResponse.json(createErrorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 });
  }
}

export const PUT = withAdmin(async (req) => {
  try {
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
    }

    const body = await req.json();
    console.log('Updating technology:', { id, data: JSON.stringify(body, null, 2) });
    
    const { title, name, description, href, image, githubRepo } = body;

    if (!title || !name || !description || !href) {
      return NextResponse.json(createErrorResponse('Missing required fields', 'MISSING_FIELDS'), { status: 400 });
    }

    const existingTechnology = await prisma.technology.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });

    if (existingTechnology) {
      return NextResponse.json(createErrorResponse('Technology name already exists', 'TECHNOLOGY_NAME_ALREADY_EXISTS'), { status: 400 });
    }

    const updatedTechnology = await prisma.technology.update({
      where: { id },
      data: {
        title,
        name,
        description,
        href,
        image,
        githubRepo: githubRepo || null
      }
    });

    console.log('Technology updated successfully:', updatedTechnology.id);
    return NextResponse.json(createSuccessResponse(updatedTechnology));
  } catch (error) {
    console.error('Error updating technology:', error);
    return NextResponse.json(createErrorResponse('Failed to update technology', 'UPDATE_FAILED'), { status: 500 });
  }
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.technology.delete({
    where: { id }
  });

  return NextResponse.json(createSuccessResponse({ success: true }));
}); 