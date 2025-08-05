"use client";

import Loading from "~/components/ui/Loading";
import { useEffect, useState } from "react";
import LandingSection from "~/components/home/LandingSection";
import TrustSection from "~/components/home/TrustSection";
import ProtocolSection from "~/components/home/ProtocolSection";
import CardanoSection from "~/components/home/CardanoSection";
import CTASection from "~/components/home/CTASection";
import VideoSection from "~/components/home/VideoSection";
// import PartnerLogosCarousel from "~/components/home/PartnerLogosCarousel";

import ContactFormSection from "~/components/home/ContactFormSection";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);
  if (loading) return <Loading />;
  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: "left center" }}
        />
      </div>

      <LandingSection />
      <ProtocolSection />
      <VideoSection />
      {/* <PartnerLogosCarousel /> */}
      <TrustSection />
   
      <CardanoSection />
      <CTASection />
   
      <ContactFormSection />
    </main>
  );
}
