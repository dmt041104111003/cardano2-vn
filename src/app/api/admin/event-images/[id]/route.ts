import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";
import { createErrorResponse, createSuccessResponse } from "~/lib/api-response";
import cloudinary from "~/lib/cloudinary";

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const file = formData.get('file') as File;
    const imageUrl = formData.get('imageUrl') as string;

    if (!title || !location) {
      return NextResponse.json(createErrorResponse('Title and location are required', 'MISSING_FIELDS'), { status: 400 });
    }

    const existingEvent = await prisma.eventImages.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(createErrorResponse('Event not found', 'EVENT_NOT_FOUND'), { status: 404 });
    }

    let finalImageUrl = existingEvent.imageUrl;
    let publicId = existingEvent.publicId;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'event-images',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      finalImageUrl = (result as any).secure_url;
      publicId = (result as any).public_id;
    }

    else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    const updatedEvent = await prisma.eventImages.update({
      where: { id },
      data: {
        title,
        location,
        imageUrl: finalImageUrl,
        publicId
      }
    });

    return NextResponse.json(createSuccessResponse({
      image: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        location: updatedEvent.location,
        imageUrl: updatedEvent.imageUrl,
        publicId: updatedEvent.publicId
      }
    }));
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(createErrorResponse('Failed to update event', 'UPDATE_FAILED'), { status: 500 });
  }
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json(createErrorResponse('Missing ID', 'MISSING_ID'), { status: 400 });
  }

  await prisma.eventImages.delete({ where: { id } });
  return NextResponse.json(createSuccessResponse({ success: true }));
});
