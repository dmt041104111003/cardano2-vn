// Toast Components Interfaces
export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  timestamp: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
} 