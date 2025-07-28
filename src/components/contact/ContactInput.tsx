'use client';

import { LucideIcon } from 'lucide-react';

interface ContactInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: 'text' | 'email';
  icon: LucideIcon;
  error?: string;
  isTextarea?: boolean;
  rows?: number;
}

export default function ContactInput({
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
  error,
  isTextarea = false,
  rows = 6
}: ContactInputProps) {
  const baseClasses = "w-full pl-10 pr-4 py-3 border rounded-sm bg-white dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400";
  const errorClasses = error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-white/20';
  const iconPosition = isTextarea ? 'top-3' : 'top-1/2 transform -translate-y-1/2';

  return (
    <div className="relative">
      <Icon className={`absolute left-3 ${iconPosition} h-5 w-5 text-gray-400`} />
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          rows={rows}
          className={`${baseClasses} ${errorClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`${baseClasses} ${errorClasses}`}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
} 