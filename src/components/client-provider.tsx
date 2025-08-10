"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "~/components/toast-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationTitleUpdater } from "~/components/notification-title-updater";

const queryClient = new QueryClient();

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToastProvider>
          <NotificationTitleUpdater />
          {children}
        </ToastProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
} 