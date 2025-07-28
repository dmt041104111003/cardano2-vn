"use client";
import Footer from "~/components/footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("~/components/header"), { ssr: false });

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white relative">
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
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
