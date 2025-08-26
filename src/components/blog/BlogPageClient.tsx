'use client';

import Blog from "~/components/blog";
import Title from "~/components/title";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BlogFilters from "~/components/blog/BlogFilters";
import BlogCardSkeleton from "~/components/blog/BlogCardSkeleton";
import Pagination from "~/components/pagination";
import { useQuery } from '@tanstack/react-query';
import NotFoundInline from "~/components/ui/not-found-inline";
import { BlogPost, BlogMedia, BlogTag } from '~/constants/posts';
import { useNotifications } from "~/hooks/useNotifications";

function getYoutubeIdFromUrl(url: string) {
  const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function BlogPageClient() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  useNotifications();

  const {
    data: postsData,
  } = useQuery({
    queryKey: ['public-posts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/posts?public=1');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });
  const posts: BlogPost[] = postsData?.data || [];

  const {
    data: tagsData,
  } = useQuery({
    queryKey: ['public-tags'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      return data?.data || []; 
    }
  });
  const allTags: BlogTag[] = tagsData || [];

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchTitle = post.title.toLowerCase().includes(search.toLowerCase());
    const matchTags = selectedTags.length > 0 ? (Array.isArray(post.tags) && selectedTags.every(tagId => post.tags?.some(tag => tag.id === tagId))) : true;
    return matchTitle && matchTags;
  }) : [];

  const publishedPosts = Array.isArray(filteredPosts) ? filteredPosts.filter(post => post.status === 'PUBLISHED') : [];
  const totalPages = Math.ceil(publishedPosts.length / pageSize);
  const paginatedPosts = publishedPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTags]);

  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none block"
      >
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </motion.div>
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            title="Cardano2vn Blog"
            description="Insights, updates, and stories from the Andamio ecosystem. Explore our journey building trust protocols for distributed work."
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BlogFilters
            search={search}
            setSearch={setSearch}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            allTags={allTags}
          />
        </motion.div>
        
        {publishedPosts.length === 0 && posts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <NotFoundInline 
              onClearFilters={() => {
                setSearch('');
                setSelectedTags([]);
              }}
            />
          </motion.div>
        ) : (
        <motion.section className="grid gap-8 lg:grid-cols-2">
          {posts.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }
                  }
                }}
              >
                <BlogCardSkeleton />
              </motion.div>
            ))
          ) : (
            paginatedPosts.map((post, index) => {
              let imageUrl = "/images/common/loading.png";
              if (Array.isArray(post.media) && post.media.length > 0) {
                const youtubeMedia = post.media.find((m: BlogMedia) => m.type === 'YOUTUBE');
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
                <div key={post.id}>
                  <Blog
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
                </div>
              );
            })
          )}
        </motion.section>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </motion.div>
      </div>
    </main>
  );
} 