// import { NextRequest, NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';
// import { Buffer } from 'node:buffer';



// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: NextRequest) {
//   let data;
//   try {
//     data = await req.formData();
//   } catch (e) {
//     return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
//   }

//   for (const [key, value] of data.entries()) {
//     console.log('FormData:', key, value);
//   }

//   const file = data.get('file');
//   if (!file || typeof file === 'string') {
//     return NextResponse.json({ error: 'No file' }, { status: 400 });
//   }

//   let arrayBuffer;
//   try {
//     arrayBuffer = await file.arrayBuffer();
//   } catch (e) {
//     return NextResponse.json({ error: 'Cannot read file buffer' }, { status: 400 });
//   }
//   const buffer = Buffer.from(arrayBuffer);
//   console.log('Buffer size:', buffer.length);

//   try {
//     const upload = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { resource_type: 'image' },
//         (err, result) => {
//           if (err) {
//             console.error('Cloudinary upload error:', err);
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         }
//       );
//       stream.end(buffer);
//     });
//     return NextResponse.json({ url: (upload as any).secure_url });
//   } catch (e) {
//     console.error('UPLOAD ERROR:', e);
//     return NextResponse.json({ error: String(e) || 'Upload failed' }, { status: 500 });
//   }
// } 

export async function GET() {
  return new Response('Not implemented', { status: 501 });
} 