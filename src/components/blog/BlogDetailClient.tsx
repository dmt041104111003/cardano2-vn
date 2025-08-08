"use client";
import { useEffect, useState, useRef } from "react";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import Header from "~/components/header";
import ShareModal from "~/components/blog/ShareModal";
import CommentSection from "~/components/blog/CommentSection";
import ReactionCount from "~/components/blog/ReactionCount";
import BlogDetailSkeleton from "~/components/blog/BlogDetailSkeleton";
import { useSession } from "next-auth/react";
import { useToastContext } from '~/components/toast-provider';
import { TipTapPreview } from '~/components/ui/tiptap-preview';
import { useQuery } from '@tanstack/react-query';
import { BlogPostDetail, BlogTag } from '~/constants/posts';
import { Comment } from '~/constants/comment';
import { scrollToCommentWithRetry } from '~/lib/mention-highlight';

export default function BlogDetailClient({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [showReactions, setShowReactions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAllComments, setShowAllComments] = useState(true);
  const proseRef = useRef<HTMLDivElement>(null);
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#comment-')) {
        const commentId = hash.replace('#comment-', '');
        setTimeout(() => {
          scrollToCommentWithRetry(commentId);
        }, 1000);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const {
    data: postData,
    isLoading: loadingPost,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['public-post-detail', slug],
    queryFn: async () => {
      const res = await fetch(`/api/admin/posts/${slug}?public=1`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug
  });
  const post: BlogPostDetail | null = postData?.post || null;

  const {
    data: reactionsData,
    refetch: refetchReactions,
  } = useQuery({
    queryKey: ['post-reactions', slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/react?postId=${slug}`);
      if (!res.ok) throw new Error('Failed to fetch reactions');
      return res.json();
    },
    enabled: !!slug
  });
  const reactions: { [type: string]: number } = reactionsData?.reactions || {};

  const {
    data: currentUserReactionData,
    refetch: refetchCurrentUserReaction,
  } = useQuery({
    queryKey: ['post-current-user-reaction', slug, isLoggedIn],
    queryFn: async () => {
      if (!isLoggedIn) return { currentUserReaction: null };
      const res = await fetch(`/api/blog/react?postId=${slug}&me=1`);
      if (!res.ok) throw new Error('Failed to fetch current user reaction');
      return res.json();
    },
    enabled: !!slug && isLoggedIn
  });
  const currentUserReaction: string | null = currentUserReactionData?.currentUserReaction || null;

  useEffect(() => {
    if (!proseRef.current) return;
    const prose = proseRef.current;
    prose.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
    prose.querySelectorAll('pre > code').forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;
      const btn = document.createElement('button');
      btn.innerHTML = `
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/><rect x="3" y="3" width="13" height="13" rx="2" stroke-width="2" stroke="currentColor" fill="none"/></svg>
          <span class="font-medium">Copy</span>
        </span>
      `;
      btn.className = 'code-copy-btn absolute top-2 right-2 px-2 py-1 text-xs bg-transparent text-gray-500 rounded shadow hover:bg-blue-500/20 hover:text-blue-600 transition-all duration-150 z-10 flex items-center gap-1';
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '8px';
      btn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(codeBlock.textContent || '');
          showSuccess('Copied!');
        } catch {}
      };
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }, [post?.content]);

  const handleReact = async (type: string) => {
    if (!isLoggedIn || !post) {
      showError('You need to sign in to react!');
      return;
    }
    const res = await fetch("/api/blog/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: slug, type }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(data?.error || "Failed to react. Please login and try again.");
      return;
    }
    await refetchReactions();
    await refetchCurrentUserReaction();
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
    await refetchPost();
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
    <main className="relative min-h-screen bg-white dark:bg-gray-950">
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
      
      <Header />
      <div className="pt-20">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        <article className="mx-auto max-w-4xl px-6 pb-20 lg:px-8">
          <header className="mb-12">
            <div className="mb-6">
              <time className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </time>
              <span className="mx-2 text-gray-500 dark:text-gray-500">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">by {post.author || 'Admin'}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span className="mx-2 text-gray-500 dark:text-gray-500">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Updated: {new Date(post.updatedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </>
              )}
            </div>
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white leading-tight break-words lg:text-5xl xl:text-6xl">
              {post.title}
            </h1>
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: BlogTag | string) => (
                  <span key={typeof tag === 'string' ? tag : tag.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
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
                  <img
                    src={post.media[0].url}
                    alt={post.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                )
              ) : (
                <img
                  src="/images/common/loading.png"
                  alt={post.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              )}
              <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Image not available</span>
              </div>
            </div>
          </div>
          <TipTapPreview content={post.content} />

          {post.githubRepo && (
            <div className="my-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Support the project on GitHub</div>
                <div className="text-gray-600 dark:text-gray-400 mb-6">
                  If you find <strong>{post.githubRepo.includes('http') ? post.githubRepo.split('/').pop() : post.githubRepo.split('/')[1]}</strong> useful, please click the ⭐ button to support!
                </div>
                <a
                  href={post.githubRepo.startsWith('http') ? post.githubRepo : `https://github.com/${post.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="mb-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <ReactionCount 
                reactions={reactions}
              />
              <div className="flex items-center gap-4">
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
            <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <div 
                className="relative flex flex-1 items-center justify-center"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                <button 
                  className={`flex items-center justify-center gap-2 py-3 text-gray-600 dark:text-gray-400 transition-colors w-full ${currentUserReaction ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  <span className={`flex items-center justify-center text-2xl ${currentUserReaction ? 'scale-110' : 'hover:scale-110'}`} style={{ minWidth: 28, minHeight: 28 }}>
                    {currentUserReaction ? REACTION_EMOJIS[currentUserReaction] || '👍' : <ThumbsUp className="h-5 w-5" />}
                  </span>
                  <span className={`font-medium ml-1 ${currentUserReaction ? 'text-blue-600 dark:text-blue-400' : ''}`} style={{ lineHeight: '28px', fontSize: '18px' }}>
                    {currentUserReaction ? currentUserReaction.charAt(0) + currentUserReaction.slice(1).toLowerCase() : 'Like'}
                  </span>
                </button>
                {showReactions && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 z-10 p-1">
                    <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-full px-6 py-4 shadow-2xl">
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
                          className={`w-14 h-14 rounded-full bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center text-gray-900 dark:text-gray-100 text-3xl group relative overflow-hidden ${currentUserReaction === reaction.type ? 'ring-4 ring-blue-400 scale-110' : 'hover:scale-125'}`}
                          aria-label={reaction.label}
                        >
                          <span className="group-hover:scale-110 transition-transform duration-200">
                            {reaction.emoji}
                          </span>
                          <div className="absolute inset-0 bg-gray-100/5 dark:bg-gray-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="flex flex-1 items-center justify-center gap-2 py-3 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
                onClick={() => setShowAllComments((v) => !v)}
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Comment</span>
              </button>
              <button 
                className="flex flex-1 items-center justify-center gap-2 py-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
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

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Published on {new Date(post.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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