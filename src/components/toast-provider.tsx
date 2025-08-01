"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Info, XCircle } from "lucide-react";
import { Toast, ToastContextType } from '~/constants/toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isClient, setIsClient] = useState(false);
  const errorKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToast = (type: Toast["type"], title: string, message?: string) => {
    if (!isClient) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
    };

    if (type === "error") {
      const errorKey = `${title}-${message}`;
      if (errorKeys.current.has(errorKey)) {
        return;
      }
      errorKeys.current.add(errorKey);
      setTimeout(() => {
        errorKeys.current.delete(errorKey);
      }, 5000);
    }

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string) => {
    addToast("success", title, message);
  };

  const showError = (title: string, message?: string) => {
    addToast("error", title, message);
  };

  const showInfo = (title: string, message?: string) => {
    addToast("info", title, message);
  };

  return (
    <ToastContext.Provider value={{ toasts, showSuccess, showError, showInfo, removeToast }}>
      {children}
      {isClient && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2" suppressHydrationWarning>
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`
                  relative max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4
                  ${toast.type === "success" ? "border-green-500" : ""}
                  ${toast.type === "error" ? "border-red-500" : ""}
                  ${toast.type === "info" ? "border-blue-500" : ""}
                `}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {toast.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {toast.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                    {toast.message && (
                      <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      title="Close notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </ToastContext.Provider>
  );
} 