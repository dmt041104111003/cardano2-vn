"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navbars } from "~/constants/navbars";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";
import { useUser } from "~/hooks/useUser";
import { WalletAvatar } from "~/components/WalletAvatar";
import { ThemeToggle } from "~/components/ui/theme-toggle";

type NavbarType = { id: number; title: string; href: string };

export default function Header() {
  const { data: session } = useSession();
  const { isAdmin } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Debug session
  console.log("[Header] Session user:", session?.user);
  console.log("[Header] Session user image:", (session?.user as any)?.image);
  
  if (pathname.startsWith("/docs")) return null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full border-b border-gray-200 dark:border-white/20 bg-white/80 dark:bg-black/20 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center"
          >
            <Link href={routers.home} className="flex items-center gap-3">
              <Image className="text-xl h-10 w-auto font-bold text-gray-900 dark:text-white" loading="lazy" src={images.logo} alt="Cardano2vn" />
            </Link>
          </motion.section>

          <section className="hidden md:flex items-center space-x-8">
            {navbars.map((navbar: NavbarType) => (
              (navbar.title === "Login" && session) ? null : (
                <Link href={navbar.href} key={navbar.id} className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white">
                  {navbar.title}
                </Link>
              )
            ))}
            
            <ThemeToggle />
            
            {session && isAdmin && (
              <Link
                href="/admin/posts"
                className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white shadow-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-white/50 hover:bg-gray-200 dark:hover:bg-gray-700/50"
              >
                <span>Admin Panel</span>
              </Link>
            )}
            
            {session && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {(session.user as { image?: string })?.image ? (
                    <Image
                      src={(session.user as { image?: string }).image!}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-white"
                      onError={(e) => {
                        console.error("[Header] Image load error:", e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <WalletAvatar address={(session.user as { address?: string })?.address || null} size={32} className="border border-gray-300 dark:border-white" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-white font-mono">
                    {(session.user as { address?: string })?.address ? 
                      formatWalletAddress((session.user as { address?: string }).address || "") :
                      (session.user as { name?: string })?.name || "User"
                    }
                  </span>
                </div>
                <button onClick={() => signOut()} className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white">
                  Sign out
                </button>
              </div>
            )}
          </section>

          <section className="md:hidden">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </section>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-sm"
          >
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-3">
                {navbars.map((navbar: NavbarType) => (
                  (navbar.title === "Login" && session) ? null : (
                    <Link
                      href={navbar.href}
                      key={navbar.id}
                      onClick={closeMenu}
                      className="block font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white py-2"
                    >
                      {navbar.title}
                    </Link>
                  )
                ))}
                <div className="py-2">
                  <ThemeToggle />
                </div>
              </div>

              <div className="space-y-4">
                {session && isAdmin && (
                  <div className="flex items-center gap-4 mb-4">
                    <Link
                      href="/admin/posts"
                      onClick={closeMenu}
                      className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white shadow-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-white/50 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                    >
                     <span>Admin Panel</span>
                    </Link>
                  </div>
                )}
                
                {session && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(session.user as { image?: string })?.image ? (
                        <Image
                          src={(session.user as { image?: string }).image!}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-white"
                        />
                      ) : (
                        <WalletAvatar address={(session.user as { address?: string })?.address || null} size={32} className="border border-gray-300 dark:border-white" />
                      )}
                      <span className="text-sm text-gray-700 dark:text-white font-mono">
                        {(session.user as { address?: string })?.address ? 
                          formatWalletAddress((session.user as { address?: string }).address || "") :
                          (session.user as { name?: string })?.name || "User"
                        }
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
