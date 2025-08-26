"use client";

import Loading from "~/components/ui/Loading";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LandingSection from "~/components/home/LandingSection";
import TrustSection from "~/components/home/TrustSection";
import ProtocolSection from "~/components/home/ProtocolSection";
import CourseSection from "~/components/home/CourseSection";
// import CardanoSection from "~/components/home/CardanoSection";
import CTASection from "~/components/home/CTASection";
import VideoSection from "~/components/home/VideoSection";
// import PartnerLogosCarousel from "~/components/home/PartnerLogosCarousel";

import ContactFormSection from "~/components/home/ContactFormSection";
import WaveFooterSection from "~/components/home/WaveFooterSection";
// import StatsSection from "~/components/home/StatsSection";
import { useNotifications } from "~/hooks/useNotifications";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  
  useNotifications();
  
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);
  if (loading) return <Loading />;
  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
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
          style={{ objectPosition: "left center" }}
        />
      </motion.div>

      <LandingSection />
      {/* <StatsSection /> */}
      <ProtocolSection />
      <VideoSection />
      {/* <PartnerLogosCarousel /> */}
      <TrustSection />
   
      {/* <CardanoSection /> */}
      <CTASection />
      <CourseSection />
      <ContactFormSection />      
      <WaveFooterSection />
    </main>
  );
}
