'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Users, 
  Tags, 
  Menu,
  X,
  Home,
  LogOut,
  Image,
  FolderOpen,
  Cpu,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '~/hooks/useUser';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Loading from '~/components/ui/Loading';

const adminNavItems = [
  {
    title: 'Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
  },
  {
    title: 'Technologies',
    href: '/admin/technologies',
    icon: Cpu,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Tags',
    href: '/admin/tags',
    icon: Tags,
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image,
  },
];

function compact(str?: string | null) {
  if (!str) return '';
  return str.length > 12 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/');
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return <Loading />;
  }

  return (
    <div className="admin-root min-h-screen bg-gray-50 relative" data-admin="true" suppressHydrationWarning>
      <div className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 opacity-3 pointer-events-none select-none block">
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              onClick={() => setSidebarOpen(false)}
              suppressHydrationWarning
            />
            <motion.div
              key="sidebar"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl"
              suppressHydrationWarning
            >
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {user?.image ? (
                  <img src={user.image} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">U</div>
                )}
                <div className="flex flex-col min-w-0">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <div className="flex flex-col items-start w-[160px] mt-1">
                    <span className="text-xs text-gray-400 w-full">{user?.id ? compact(user.id) : 'No ID'}</span>
                    <span className="text-xs text-gray-400 w-full">{user?.address ? compact(user.address) : 'No address'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close sidebar"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-4 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  title="Back to Home"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col" suppressHydrationWarning>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200" suppressHydrationWarning>
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            {user?.image ? (
              <img src={user.image} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">U</div>
            )}
            <div className="flex flex-col min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <div className="flex flex-col items-start w-[160px] mt-1">
                <span className="text-xs text-gray-400 w-full">{user?.id ? compact(user.id) : 'No ID'}</span>
                <span className="text-xs text-gray-400 w-full">{user?.address ? compact(user.address) : 'No address'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 border-b border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              title="Back to Home"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4" suppressHydrationWarning>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="lg:pl-64" suppressHydrationWarning>
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden" suppressHydrationWarning>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 