"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function DocsRouteHandler() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (!pathname.startsWith('/docs')) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      const themeToggle = document.querySelector('[data-fumadocs-theme-toggle]');
      if (themeToggle) {
        (themeToggle as HTMLElement).style.display = '';
      }
    }
  }, [pathname]);

  return null;
} 