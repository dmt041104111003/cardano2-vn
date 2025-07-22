import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { id: slug },
    select: {
      title: true,
      content: true,
      media: { select: { url: true } },
    },
  });
  if (!post) return null;
  return {
    title: post.title,
    description: post.content?.replace(/<[^>]+>/g, '').slice(0, 150) || post.title,
    image: post.media && post.media.length > 0 ? post.media[0].url : 'https://cardano2-vn.vercel.app/images/common/logo.png',
    url: `https://cardano2-vn.vercel.app/blog/${slug}`,
  };
}

export async function GET(
  req: NextRequest,
  { params }: Promise<{ params: { slug: string } }>
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams.params;
  const post = await getPost(slug);
  if (!post) {
    return new NextResponse('Not found', { status: 404 });
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:url" content="${post.url}" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${post.title}" />
        <meta property="og:description" content="${post.description}" />
        <meta property="og:image" content="${post.image}" />
        <title>${post.title}</title>
      </head>
      <body>
        <h1>${post.title}</h1>
        <p>${post.description}</p>
        <img src="${post.image}" alt="og image" />
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
} 