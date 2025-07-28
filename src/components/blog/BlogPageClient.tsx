'use client';

import Blog from "~/components/blog";
import Title from "~/components/title";
import { useEffect, useState } from "react";
import BlogFilters from "~/components/blog/BlogFilters";
import BlogCardSkeleton from "~/components/blog/BlogCardSkeleton";
import { Pagination } from "~/components/ui/pagination";
import { useQuery } from '@tanstack/react-query';

interface Media {
  id: string;
  url: string;
  type: string;
}
interface Tag {
  id: string;
  name: string;
}
interface BlogPost {
  id: string;
  title: string;
  status: string;
  author?: string;
  slug?: string;
  createdAt: string;
  media?: Media[];
  tags?: Tag[];
}

function getYoutubeIdFromUrl(url: string) {
  const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function BlogPageClient() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    data: postsData,
    isLoading: loadingPosts,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['public-posts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/posts?public=1');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });
  const posts: BlogPost[] = postsData?.posts || [];

  const {
    data: tagsData,
    isLoading: loadingTags,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ['public-tags'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      return res.json();
    }
  });
  const allTags: Tag[] = tagsData?.tags || [];

  const filteredPosts = posts.filter(post => {
    const matchTitle = post.title.toLowerCase().includes(search.toLowerCase());
    const matchTags = selectedTags.length > 0 ? (Array.isArray(post.tags) && selectedTags.every(tagId => post.tags?.some(tag => tag.id === tagId))) : true;
    return matchTitle && matchTags;
  });

  const publishedPosts = filteredPosts.filter(post => post.status === 'PUBLISHED');
  const totalPages = Math.ceil(publishedPosts.length / pageSize);
  const paginatedPosts = publishedPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTags]);

  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Cardano2vn Blog"
          description="Insights, updates, and stories from the Andamio ecosystem. Explore our journey building trust protocols for distributed work."
        />
        <BlogFilters
          search={search}
          setSearch={setSearch}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
        />
        <section className="grid gap-8 lg:grid-cols-2">
          {posts.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : (
            paginatedPosts.map((post) => {
              let imageUrl = "/images/common/loading.png";
              if (Array.isArray(post.media) && post.media.length > 0) {
                const youtubeMedia = post.media.find((m: Media) => m.type === 'YOUTUBE');
                if (youtubeMedia) {
                  const videoId = getYoutubeIdFromUrl(youtubeMedia.url);
                  if (videoId) {
                    imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }
                } else {
                  imageUrl = post.media[0].url;
                }
              }
              return (
                <Blog
                  key={post.id}
                  image={imageUrl}
                  title={post.title}
                  author={post.author || "Admin"}
                  slug={post.slug || post.id}
                  datetime={new Date(post.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                  tags={post.tags || []}
                />
              );
            })
          )}
        </section>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={publishedPosts.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
} 