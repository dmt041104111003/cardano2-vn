"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "~/components/toast-provider";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
} 