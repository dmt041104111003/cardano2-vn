'use client';

import Blog from "~/components/blog";
import Title from "~/components/title";
import { useEffect, useState } from "react";

interface Media {
  id: string;
  url: string;
  type: string;
}
interface BlogPost {
  id: string;
  title: string;
  status: string;
  author?: string;
  slug?: string;
  createdAt: string;
  media?: Media[];
}

function getYoutubeIdFromUrl(url: string) {
  const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    fetch("/api/admin/posts?public=1")
      .then(res => res.json())
      .then(data => setPosts(Array.isArray(data.posts) ? data.posts : []));
  }, []);

  return (
    <main className="relative pt-20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Title
          title="Cardano2vn Blog"
          description="Insights, updates, and stories from the Andamio ecosystem. Explore our journey building trust protocols for distributed work."
        />
        <section className="grid gap-8 lg:grid-cols-2">
          {posts.filter(post => post.status === 'PUBLISHED').map((post) => {
            let imageUrl = "/images/landings/01.png";
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
                action={post.status}
                title={post.title}
                author={post.author || "Admin"}
                slug={post.slug || post.id}
                datetime={new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}