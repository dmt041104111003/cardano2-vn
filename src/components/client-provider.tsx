"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "~/components/toast-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('Cardano2VN Service Worker registered successfully:', reg);
          })
          .catch(err => {
            console.error('Cardano2VN Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 