"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import Header from "~/components/header";
import { useEffect, useState } from "react";
import ShareModal from "~/components/blog/ShareModal";
import CommentSection from "~/components/blog/CommentSection";
import ReactionCount from "~/components/blog/ReactionCount";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  tags: { id: string; name: string }[];
  media: { type: string; url: string; id?: string }[];
  comments: { id: string; text: string; author: string; createdAt: string }[];
  shares: number;
}

interface Tag {
  id: string;
  name: string;
}

type RawComment = { id: string; text: string; author: string; createdAt: string };

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${params.slug}?public=1`)
      .then(res => res.json())
      .then(data => setPost(data.post));
  }, [params.slug]);

  if (!post) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  function getYoutubeIdFromUrl(url: string) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
    return match ? match[1] : '';
  }

  function handleReactionClick(label: string) {
    console.log('Reaction clicked:', label);
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900">
      <Header />
      <div className="pt-20">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        <article className="mx-auto max-w-4xl px-6 pb-20 lg:px-8">
          <header className="mb-12">
            <div className="mb-6">
              <time className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-sm text-gray-400">by {post.author || 'Admin'}</span>
            </div>
            <h1 className="mb-8 text-3xl font-bold text-white leading-tight break-words lg:text-5xl xl:text-6xl">
              {post.title}
            </h1>
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: Tag | string) => (
                  <span key={typeof tag === 'string' ? tag : tag.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>
          <div className="mb-12">
            <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80 lg:h-96">
              {post.media && post.media.length > 0 ? (
                post.media[0].type === 'YOUTUBE' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${post.media[0].id || getYoutubeIdFromUrl(post.media[0].url)}`}
                    title={post.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <Image
                    src={post.media[0].url}
                    alt={post.title}
                    className="object-cover w-full h-full"
                    fill
                    priority
                  />
                )
              ) : (
                <Image
                  src="/images/common/logo.png"
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="mb-6 flex items-center justify-between text-sm text-gray-400">
              <ReactionCount 
                reactions={{
                  like: 245,
                  love: 156,
                  haha: 89,
                  wow: 24,
                  sad: 0,
                  angry: 0
                }}
              />
              <div className="flex items-center gap-4">
                <span>{post.comments?.length || 0} comments</span>
                <span>{post.shares || 0} shares</span>
              </div>
            </div>
            <div className="flex items-center border-t border-gray-800 pt-4">
              <div 
                className="relative flex flex-1 items-center justify-center"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                <button 
                  className="flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-blue-400 transition-colors w-full"
                >
                  <ThumbsUp className="h-5 w-5 hover:scale-110 transition-transform" />
                  <span className="font-medium">Like</span>
                </button>
                {showReactions && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 z-10 p-1">
                    <div className="flex items-center gap-3 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-full px-6 py-4 shadow-2xl">
                      {[
                        { emoji: "👍", label: "Like", color: "bg-blue-500" },
                        { emoji: "❤️", label: "Love", color: "bg-red-500" },
                        { emoji: "😂", label: "Haha", color: "bg-yellow-500" },
                        { emoji: "😮", label: "Wow", color: "bg-yellow-500" },
                        { emoji: "😢", label: "Sad", color: "bg-yellow-500" },
                        { emoji: "😠", label: "Angry", color: "bg-red-500" },
                      ].map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => handleReactionClick(reaction.label)}
                          className="w-14 h-14 rounded-full bg-transparent hover:bg-gray-700/50 hover:scale-125 transition-all duration-200 flex items-center justify-center text-white text-3xl group relative overflow-hidden"
                          aria-label={reaction.label}
                        >
                          <span className="group-hover:scale-110 transition-transform duration-200">
                            {reaction.emoji}
                          </span>
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="flex flex-1 items-center justify-center gap-2 py-3 text-gray-400 hover:text-green-400 transition-colors group">
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Comment</span>
              </button>
              <button 
                className="flex flex-1 items-center justify-center gap-2 py-3 text-gray-400 hover:text-purple-400 transition-colors group"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Share</span>
              </button>
            </div>
            <CommentSection comments={(post.comments || []).map((c: RawComment) => ({
              id: c.id,
              author: c.author,
              content: c.text,
              time: c.createdAt,
              avatar: '',
              reactions: {
                like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
              },
              replies: [],
            }))} />
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="text-sm text-gray-400">
                Published on {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Link
                href="/blog"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to all posts
              </Link>
            </div>
          </footer>
        </article>
      </div>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        blogTitle={post.title}
        blogUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </main>
  );
} 