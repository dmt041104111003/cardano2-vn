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
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
