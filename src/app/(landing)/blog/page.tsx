'use client';

import Blog from "~/components/blog";
import Title from "~/components/title";
import { useEffect, useState } from "react";
import BlogFilters from "~/components/blog/BlogFilters";
import BlogCardSkeleton from "~/components/blog/BlogCardSkeleton";
import { Pagination } from "~/components/ui/pagination";

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

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetch("/api/admin/posts?public=1")
      .then(res => res.json())
      .then(data => setPosts(Array.isArray(data.posts) ? data.posts : []));
  }, []);

  useEffect(() => {
    fetch("/api/admin/tags")
      .then(res => res.json())
      .then(data => setAllTags(Array.isArray(data.tags) ? data.tags : []));
  }, []);

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
    <main className="relative pt-20">
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
              let imageUrl = "/images/common/logo.png";
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
                  datetime={new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
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