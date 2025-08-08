"use client";

// import { protocols } from "~/constants/protocols";
// import Protocol from "~/components/protocol";
// import Action from "~/components/action";
import { useState } from "react";
import Blog from "~/components/blog";
import { useQuery } from "@tanstack/react-query";

type TabType = "latest" | "popular";

function getYoutubeIdFromUrl(url: string) {
  const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function ProtocolSection() {
  const [activeTab, setActiveTab] = useState<TabType>("latest");

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      return data?.posts || [];
    },
  });

  const posts = postsData?.filter((p: any) => p.status === "PUBLISHED") || [];
  
  const postsWithEngagement = posts.map((post: any) => {
    const totalReactions = (post.LIKE || 0) + (post.HEART || 0) + (post.HAHA || 0) + 
                          (post.SAD || 0) + (post.ANGRY || 0) + (post.WOW || 0) + (post.SHARE || 0);
    const totalComments = post.comments || 0;
    const totalEngagement = totalReactions + totalComments;
    
    return {
      ...post,
      totalEngagement,
      totalReactions,
      totalComments
    };
  });
  
  const latestBlogs = postsWithEngagement.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  const popularBlogs = postsWithEngagement.sort((a: any, b: any) => 
    b.totalEngagement - a.totalEngagement
  ).slice(0, 3);

  const currentBlogs = activeTab === "latest" ? latestBlogs : popularBlogs;
  const displayBlogs = [...currentBlogs];
  while (displayBlogs.length < 3) displayBlogs.push(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <section id="protocol" className="relative flex min-h-[80vh] items-center border-t border-gray-200 dark:border-white/10">
      <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-12 lg:px-8">
        <div className="relative">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">The Cardano2vn Protocol</h2>
            </div>
            <p className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">Three core components enabling trust for distributed work.</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
              <button
                onClick={() => handleTabChange("latest")}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "latest"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Top 3 New</span>
                  <span className="sm:hidden">New</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("popular")}
                className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "popular"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Top 3 Hot</span>
                  <span className="sm:hidden">Hot</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="grid max-w-none gap-16 lg:grid-cols-3">
            {isLoading ? (
              [...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))
            ) : (
              displayBlogs.map((post, idx) =>
                post ? (
                  <Blog
                    key={post.id}
                    image={(() => {
                      const media = post.media?.[0];
                      if (media && typeof media.url === 'string' && media.url) {
                        const youtubeId = getYoutubeIdFromUrl(media.url);
                        if (youtubeId) {
                          return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        }
                        return media.url;
                      }
                      return "/images/common/loading.png";
                    })()}
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
                ) : (
                  <div key={idx} className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6 flex items-center justify-center min-h-[300px]">
                    <img src="/images/common/loading.png" alt="Loading" width={120} height={120} />
                  </div>
                )
              )
            )}
          </div>
        </div>
      </section>
      {/* <Action title="Next" href="#cardano" /> */}
    </section>
  );
} 