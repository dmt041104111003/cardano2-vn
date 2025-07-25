import { Metadata } from 'next';
import BlogDetailClient from '~/components/blog/BlogDetailClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://cardano2-vn.vercel.app'}/api/admin/posts/${params.slug}?public=1`);
  const data = await res.json();
  const post = data.post;
  return {
    title: post?.title || 'Blog Detail | Cardano2vn',
    description: post?.excerpt || post?.content?.slice(0, 150) || '',
    openGraph: {
      title: post?.title || 'Blog Detail | Cardano2vn',
      description: post?.excerpt || post?.content?.slice(0, 150) || '',
      images: post?.media?.[0]?.url ? [post.media[0].url] : ['/images/common/loading.png'],
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cardano2-vn.vercel.app'}/blog/${params.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title || 'Blog Detail | Cardano2vn',
      description: post?.excerpt || post?.content?.slice(0, 150) || '',
      images: post?.media?.[0]?.url ? [post.media[0].url] : ['/images/common/loading.png'],
    }
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return <BlogDetailClient slug={params.slug} />;
} 