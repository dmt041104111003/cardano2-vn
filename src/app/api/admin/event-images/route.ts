import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';
import { uploadImageFromFile, uploadImageFromUrl } from '~/lib/uploadImage';

export async function POST(request: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as { address?: string; email?: string };
    let user = null;

    if (sessionUser.address) {
      user = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true }
      });
    } else if (sessionUser.email) {
      user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

 
    const formData = await request.formData();
    const file = formData.get('file');
    const url = formData.get('url');

    let imageUrl = '';
    let publicId = '';


    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const res = await uploadImageFromFile(file);
      imageUrl = res.url;
      publicId = res.publicId;
    } else if (url && typeof url === 'string') {
      if (/^data:image\//.test(url) || /^https?:\/\//.test(url)) {
        const res = await uploadImageFromUrl(url);
        imageUrl = res.url;
        publicId = res.publicId;
      } else {
        return NextResponse.json({ error: 'Invalid image input' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

   
    return NextResponse.json({
      message: 'Image uploaded to Cloudinary',
      media: {
        url: imageUrl,
        public_id: publicId,
        type: 'IMAGE',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
