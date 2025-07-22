'use client';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 text-white">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
