"use client";

// import { protocols } from "~/constants/protocols";
// import Protocol from "~/components/protocol";
import Action from "~/components/action";
import { useEffect, useState } from "react";
import Blog from "~/components/blog";

export default function ProtocolSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/posts?public=1")
      .then(res => res.json())
      .then(data => {
        const posts = (data?.posts || []).filter((p: any) => p.status === "PUBLISHED");
        const sorted = posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBlogs(sorted.slice(0, 3));
      });
  }, []);

  const displayBlogs = [...blogs];
  while (displayBlogs.length < 3) displayBlogs.push(null);

  return (
    <section id="protocol" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
      <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
        <div className="relative">
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Protocol</h2>
            </div>
            <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Three core components enabling trust for distributed work.</p>
          </div>
          <div className="grid max-w-none gap-16 lg:grid-cols-3">
          {/* {protocols.map((protocol, index) => {
              return (
                <Protocol color={protocol.color} title={protocol.title} image={protocol.image} key={index} description={protocol.description} />
              );
            })} */}
            {displayBlogs.map((post, idx) =>
              post ? (
                <Blog
                  key={post.id}
                  image={post.media?.[0]?.url || "/images/common/loading.png"}
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
            )}
          </div>
        </div>
      </section>
      <Action title="Next" href="#cardano" />
    </section>
  );
} 