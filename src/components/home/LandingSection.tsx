"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { images } from "~/public/images";
// import Action from "~/components/action";
import AdminTabs from "./AdminTabs";
import LandingContentSection from "./LandingContentSection";
import LandingMediaSection from "./LandingMediaSection";
import LandingManageSection from "./LandingManageSection";
import FloatingNotification from "~/components/ui/FloatingNotification";

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
      const url = new URL('/api/user', window.location.origin);
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
      const response = await fetch('/api/admin/landing-content', {
        credentials: 'include'
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data?.data || [];
    },
    enabled: !!session?.user
  });

  useEffect(() => {
    console.log('LandingSection - userData:', userData);
    console.log('LandingSection - user role:', userData?.data?.role?.name);
    const adminStatus = userData?.data?.role?.name === 'ADMIN';
    console.log('LandingSection - isAdmin:', adminStatus);
    setIsAdmin(adminStatus);
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
        { url: images.loading.src, type: 'image', title: 'C2VN' },
        { url: images.loading.src, type: 'image', title: 'C2VN' },
        { url: images.loading.src, type: 'image', title: 'C2VN' },
        { url: images.loading.src, type: 'image', title: 'C2VN' }
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
    <>
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
                <LandingContentSection content={content} />
                <LandingMediaSection mediaItems={mediaItems} />
              </div>
            )}

            {activeTab === "manage" && (
              <LandingManageSection landingContents={landingContents} />
            )}
          </motion.div>
        </div>
        {/* <Action title="Next" href="#trust" /> */}
      </section>
      
      <FloatingNotification />
    </>
  );
} 