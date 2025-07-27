import Link from "next/link";
import { ComponentType } from "react";

export default function About({
  href,
  Icon,
  title,
  description,
  color,
  action,
}: {
  href: string;
  Icon: ComponentType;
  title: string;
  description: string;
  color: string;
  action: string;
}) {
  return (
    <Link href={href}>
      <div className="rounded-sm text-card-foreground px-5 py-3 group relative overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-white/40 hover:shadow-2xl">
        <div className="p-6">
          <div className="mb-4">
            <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-${color}-500/30 bg-${color}-600/20`}>
              <Icon />
            </div>
            <h3 className={`text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-${color}-600 dark:group-hover:text-${color}-300`}>{title}</h3>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
          <div className={`flex items-center gap-2 text-${color}-600 dark:text-${color}-400 transition-colors duration-200 group-hover:text-${color}-700 dark:group-hover:text-${color}-300`}>
            <span className="text-sm font-medium">{action}</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
