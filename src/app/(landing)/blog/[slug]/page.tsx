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
import BlogDetailSkeleton from "~/components/blog/BlogDetailSkeleton";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  authorId?: string;
  authorWallet?: string;
  tags: { id: string; name: string }[];
  media: { type: string; url: string; id?: string }[];
  comments: { id: string; text: string; author: string; createdAt: string }[];
  comments_rel?: unknown[];
  shares: number;
  reactions: { type: string }[];
}

interface Tag {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: {
    wallet?: string;
    image?: string;
  } | null;
  parentCommentId?: string | null;
  replies?: Comment[];
  parentUserId?: string;
  parentAuthor?: string;
  author?: string;
  time?: string;
  avatar?: string;
  isPostAuthor?: boolean;
}


export default function BlogDetailPage() {
  const params: Record<string, string> = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [reactions, setReactions] = useState<{ [type: string]: number }>({});
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [showReactions, setShowReactions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentUserReaction, setCurrentUserReaction] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(true);

 
  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/admin/posts/${params.slug}?public=1`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post);
      });
    fetch(`/api/blog/react?postId=${params.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.reactions) setReactions(data.reactions);
      });
    if (isLoggedIn) {
      fetch(`/api/blog/react?postId=${params.slug}&me=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.currentUserReaction) setCurrentUserReaction(data.currentUserReaction);
          else setCurrentUserReaction(null);
        });
    } else {
      setCurrentUserReaction(null);
    }
  }, [params.slug, isLoggedIn]);

  const handleReact = async (type: string) => {
    if (!isLoggedIn || !post) return;
    setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    setCurrentUserReaction(type);
    const res = await fetch("/api/blog/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id, type }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Reaction API error:", data);
      alert(data?.error || "Failed to react. Please login and try again.");
      return;
    }
    fetch(`/api/blog/react?postId=${post.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.reactions) setReactions(data.reactions);
      });
    setCurrentUserReaction(type);
  };

  const handleSubmitComment = async (commentText: string) => {
    if (!post) return;
    const res = await fetch("/api/blog/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id, content: commentText }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "Failed to comment. Please login and try again.");
      return;
    }
    fetch(`/api/admin/posts/${post.id}?public=1`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post);
      });
  };

  if (!post) return <BlogDetailSkeleton />;

  function getYoutubeIdFromUrl(url: string) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
    return match ? match[1] : '';
  }


  const REACTION_EMOJIS: Record<string, string> = {
    LIKE: "👍",
    HEART: "❤️",
    HAHA: "😂",
    WOW: "😮",
    SAD: "😢",
    ANGRY: "😠"
  };


  function flattenComments(comments: { id: string; text?: string; content?: string; createdAt?: string; userId?: string; user?: { wallet?: string; image?: string } | null; parentCommentId?: string | null; author?: string; avatar?: string; }[]): Comment[] {
    return comments.map((c) => ({
      id: c.id,
      content: c.text ?? c.content ?? '',
      createdAt: c.createdAt ?? '',
      userId: c.userId ?? '',
      user: c.user ?? null,
      parentCommentId: c.parentCommentId !== undefined ? c.parentCommentId : null,
      replies: [],
      author: c.user?.wallet ?? c.author ?? '',
      avatar: c.user?.image ?? c.avatar ?? '',
    }));
  }

  function buildNestedComments(flatComments: Comment[], postId: string, authorId: string, authorWallet?: string) {
    const commentMap = new Map<string, Comment & { replies: Comment[]; parentUserId?: string; parentAuthor?: string }>();
    flatComments.forEach((c) => commentMap.set(c.id, { ...c, replies: [] }));
    const rootComments: (Comment & { replies: Comment[]; parentUserId?: string; parentAuthor?: string })[] = [];
    function getDepth(c: Comment & { parentCommentId?: string | null }): number {
      let depth = 1;
      let cur = c;
      while (cur.parentCommentId) {
        const parent = commentMap.get(cur.parentCommentId);
        if (!parent) break;
        depth++;
        cur = parent;
      }
      return depth;
    }
    flatComments.forEach((c) => {
      if (!c.replies) c.replies = [];
      if (!c.author) c.author = '';
      if (!c.createdAt) c.createdAt = '';
      if (c.parentCommentId) {
        let parent = commentMap.get(c.parentCommentId);
        const depth = getDepth(c);
        if (depth > 3) {
          let cur = c;
          let d = depth;
          while (d > 3 && cur.parentCommentId) {
            cur = commentMap.get(cur.parentCommentId)!;
            d--;
          }
          if (!cur.replies) cur.replies = [];
          parent = { ...cur, replies: cur.replies ?? [] };
        }
        if (parent) {
          commentMap.get(c.id)!.parentUserId = parent.userId;
          commentMap.get(c.id)!.parentAuthor = parent.user?.wallet || parent.author || '';
          if (!parent.replies) parent.replies = [];
          parent.replies.push(commentMap.get(c.id)!);
        }
      } else {
        rootComments.push(commentMap.get(c.id)!);
      }
    });
    rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    function mapComment(c: Comment & { replies?: Comment[]; parentUserId?: string; parentAuthor?: string }): Comment {
      const isPostAuthor = !!(c.userId && authorId && c.userId === authorId);
      return {
        id: c.id,
        userId: c.userId,
        author: isPostAuthor ? (authorWallet || c.user?.wallet || c.author || '') : (c.user?.wallet ?? c.author ?? ''),
        content: c.content ?? '',
        createdAt: c.createdAt ?? '',
        time: c.time ?? c.createdAt ?? '',
        avatar: c.avatar ?? '',
        replies: (c.replies ?? []).map(mapComment), // ensure recursive mapping for replies
        parentCommentId: c.parentCommentId,
        parentUserId: c.parentUserId,
        parentAuthor: c.parentAuthor,
        isPostAuthor,
      };
    }
    return rootComments.map(mapComment);
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
                reactions={reactions}
              />
              <div className="flex items-center gap-4">
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
            <div className="flex items-center border-t border-gray-800 pt-4">
              <div 
                className="relative flex flex-1 items-center justify-center"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                <button 
                  className={`flex items-center justify-center gap-2 py-3 text-gray-400 transition-colors w-full ${currentUserReaction ? 'text-blue-400' : 'hover:text-blue-400'}`}
                >
                  <span className={`flex items-center justify-center text-2xl ${currentUserReaction ? 'scale-110' : 'hover:scale-110'}`} style={{ minWidth: 28, minHeight: 28 }}>
                    {currentUserReaction ? REACTION_EMOJIS[currentUserReaction] || '👍' : <ThumbsUp className="h-5 w-5" />}
                  </span>
                  <span className={`font-medium ml-1 ${currentUserReaction ? 'text-blue-400' : ''}`} style={{ lineHeight: '28px', fontSize: '18px' }}>
                    {currentUserReaction ? currentUserReaction.charAt(0) + currentUserReaction.slice(1).toLowerCase() : 'Like'}
                  </span>
                </button>
                {showReactions && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 z-10 p-1">
                    <div className="flex items-center gap-3 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-full px-6 py-4 shadow-2xl">
                      {[
                        { emoji: "👍", label: "Like", color: "bg-blue-500", type: "LIKE" },
                        { emoji: "❤️", label: "Love", color: "bg-red-500", type: "HEART" },
                        { emoji: "😂", label: "Haha", color: "bg-yellow-500", type: "HAHA" },
                        { emoji: "😮", label: "Wow", color: "bg-yellow-500", type: "WOW" },
                        { emoji: "😢", label: "Sad", color: "bg-yellow-500", type: "SAD" },
                        { emoji: "😠", label: "Angry", color: "bg-red-500", type: "ANGRY" },
                      ].map((reaction, index) => (
                        <button
                          key={index}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleReact(reaction.type);
                            setShowReactions(false);
                          }}
                          className={`w-14 h-14 rounded-full bg-transparent hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center text-white text-3xl group relative overflow-hidden ${currentUserReaction === reaction.type ? 'ring-4 ring-blue-400 scale-110' : 'hover:scale-125'}`}
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
              
              <button 
                className="flex flex-1 items-center justify-center gap-2 py-3 text-gray-400 hover:text-green-400 transition-colors group"
                onClick={() => setShowAllComments((v) => !v)}
              >
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
            <CommentSection 
              comments={buildNestedComments(flattenComments(post.comments || []), post.id, post.authorId || '', post.authorWallet)}
              postId={post.id}
              onSubmitComment={handleSubmitComment}
              showAllComments={showAllComments}
            />
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