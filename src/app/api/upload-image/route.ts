import { NextResponse } from 'next/server';
import cloudinary from '~/lib/cloudinary';
import { createErrorResponse } from '~/lib/api-response';
import { createSuccessResponse } from '~/lib/api-response';
import { withAuth } from '~/lib/api-wrapper';

export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(createErrorResponse('No file provided', 'NO_FILE_PROVIDED'), { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'uploads',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json(createSuccessResponse({
      media: {
        url: (result as any).secure_url,
        public_id: (result as any).public_id,
      }
    }));
  } catch (error) {
    return NextResponse.json(createErrorResponse('Upload failed', 'UPLOAD_FAILED'), { status: 500 });
  }
});
