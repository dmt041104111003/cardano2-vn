"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";
import Action from "~/components/action";
import LandingContentManagerWrapper from "./LandingContentManager";
import AdminTabs from "./AdminTabs";
import LandingContent from "./LandingContent";
import LandingMedia from "./LandingMedia";

export default function LandingSection() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "manage">("content");

  const { data: userData } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      if (!session?.user) {
        return null;
      }
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/auth/me', window.location.origin);
      if (sessionUser.address) url.searchParams.set('address', sessionUser.address);
      if (sessionUser.email) url.searchParams.set('email', sessionUser.email);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }
      return response.json();
    },
    enabled: !!session?.user,
  });

  const { data: landingContents = [] } = useQuery({
    queryKey: ['landing-content'],
    queryFn: async () => {
      const response = await fetch('/api/admin/landing-content');
      if (!response.ok) {
        return [];
      }
      return response.json();
    }
  });

  useEffect(() => {
    setIsAdmin(userData?.user?.role === 'ADMIN');
  }, [userData]);

  const handleTabChange = (tab: "content" | "manage") => {
    setActiveTab(tab);
  };

  const getMediaItems = () => {
    const items: any[] = [];
    if (landingContents.length > 0) {
      const firstContent = landingContents[0];
      
      if (firstContent.media1Url) {
        items.push({
          url: firstContent.media1Url,
          type: 'image',
          title: firstContent.title || 'Media 1'
        });
      }
      
      if (firstContent.media2Url) {
        items.push({
          url: firstContent.media2Url,
          type: 'image',
          title: firstContent.title || 'Media 2'
        });
      }
      
      if (firstContent.media3Url) {
        items.push({
          url: firstContent.media3Url,
          type: 'image',
          title: firstContent.title || 'Media 3'
        });
      }
      
      if (firstContent.media4Url) {
        items.push({
          url: firstContent.media4Url,
          type: 'image',
          title: firstContent.title || 'Media 4'
        });
      }
    }
    
    if (items.length === 0) {
      return [
        { url: images.landing01.src, type: 'image', title: 'Cardano Platform' },
        { url: images.landing02.src, type: 'image', title: 'Smart Contracts' },
        { url: images.landing03.src, type: 'image', title: 'Blockchain Tech' },
        { url: images.landing04.src, type: 'image', title: 'DeFi Solutions' }
      ];
    }
    
    return items;
  };

  const mediaItems = getMediaItems();

  const getContent = () => {
    if (landingContents.length > 0) {
      const firstContent = landingContents[0];
      return {
        title: firstContent.title || "",
        subtitle: firstContent.subtitle || "", 
        description: firstContent.description || "",
        mainText: firstContent.mainText || "",
        subText: firstContent.subText || ""
      };
    }
    
    return {
      title: "",
      subtitle: "",
      description: "", 
      mainText: "",
      subText: ""
    };
  };

  const content = getContent();

  return (
    <section id="Landing" className="relative flex min-h-screen items-center overflow-hidden">
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          className="relative"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {isAdmin && (
            <AdminTabs activeTab={activeTab} handleTabChange={handleTabChange} />
          )}

          {activeTab === "content" && (
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <section className="relative">
                <h1 className="mb-10 text-5xl font-bold  lg:text-8xl">
                  <span className="block tracking-tight text-gray-900 dark:text-white">{content.title}</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text tracking-tight text-gray-900 dark:text-transparent drop-shadow-lg">
                    {content.subtitle}
                  </span>
                  <span className="mt-4 block text-2xl font-normal text-gray-600 dark:text-gray-300 lg:text-4xl">{content.description}</span>
                </h1>
                <div className="relative mb-12 border-l-2 border-gray-300 dark:border-white/20 pl-6">
                  <p className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                    {content.mainText}
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">{content.subText}</p>
                </div>
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Link
                    href={routers.about}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-blue-600 dark:bg-white px-8 py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
                  >
                    Start With Cardano2vn
                  </Link>
                  <Link
                    href={routers.docs}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    View Documents
                  </Link>
                </div>
              </section>
              <section className="relative hidden lg:block">
                <div className="relative">
                  <div className="relative h-[55vh] w-full">
                    {mediaItems[0] && (
                      <div className="absolute left-12 top-0 z-10 h-48 w-56 -rotate-2 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${mediaItems[0].url})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
                        <div className="relative flex h-full flex-col justify-end p-4">
                          <div className="mb-3 h-8 w-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                            <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {mediaItems[1] && (
                      <div className="absolute right-8 top-8 z-20 h-64 w-64 rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${mediaItems[1].url})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-800/40 to-transparent"></div>
                        <div className="relative flex h-full flex-col justify-end p-4">
                          <div className="mb-3 h-12 w-full bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                          <div className="space-y-2">
                            <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                            <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-white/10"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {mediaItems[2] && (
                      <div className="absolute bottom-24 left-4 z-30 h-60 w-72 -rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${mediaItems[2].url})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent"></div>
                        <div className="relative flex h-full flex-col justify-end p-4">
                          <div className="mb-3 h-12 w-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                          <div className="space-y-2">
                            <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20"></div>
                            <div className="h-1.5 w-2/3 bg-gray-200 dark:bg-white/10"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {mediaItems[3] && (
                      <div className="absolute bottom-12 right-12 z-40 h-52 w-52 rotate-3 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${mediaItems[3].url})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/40 to-transparent"></div>
                        <div className="relative flex h-full flex-col justify-end p-4">
                          <div className="mb-3 h-10 w-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-3/5 bg-gray-300 dark:bg-white/20"></div>
                            <div className="h-1.5 w-4/5 bg-gray-200 dark:bg-white/10"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="w-full">
              <LandingContentManagerWrapper />
            </div>
          )}
        </motion.div>
      </div>
      <Action title="Next" href="#trust" />
    </section>
  );
} 