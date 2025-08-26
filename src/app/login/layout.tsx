import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Cardano2vn",
  description: "Login to Cardano2vn with your preferred wallet or social account",
  keywords: ["login", "cardano", "wallet", "authentication", "cardano2vn"],
  authors: [{ name: "Cardano2vn Team" }],
  creator: "Cardano2vn",
  publisher: "Cardano2vn",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Login - Cardano2vn",
    description: "Login to Cardano2vn with your preferred wallet or social account",
    type: "website",
    siteName: "Cardano2vn",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Cardano2vn",
    description: "Login to Cardano2vn with your preferred wallet or social account",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Background Logo */}
      {/* <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-15 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </div> */}
      
      {children}
    </div>
  );
} 