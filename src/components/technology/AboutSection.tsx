"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AboutContent } from '~/constants/about';

export default function AboutSection() {
  const { data: queryData, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const response = await fetch('/api/admin/about', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch about content');
      }
      return response.json();
    }
  });

  const aboutContent: AboutContent | null = queryData?.data || null;

  if (isLoading) {
    return (
      <section className="mb-16 text-left">
        <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
          <div className="flex w-full gap-7 max-sm:flex-col">
            <div className='m relative aspect-video w-[60%] rounded-3xl before:absolute before:left-8 before:top-8 before:h-full before:w-full before:rounded-3xl before:bg-gray-300 dark:before:bg-slate-900 before:shadow-xl before:content-[""] max-sm:w-full animate-pulse'>
              <div className="absolute inset-0 z-10 block h-full w-full rounded-xl bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="z-10 flex w-[40%] flex-col items-start gap-[15px] max-md:gap-3 max-sm:w-full">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </aside>
      </section>
    );
  }

  if (!aboutContent) {
    return null;
  }

  return (
    <section className="mb-16 text-left">
      <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
        <div className="flex w-full gap-7 max-sm:flex-col">
          <div className='m relative aspect-video w-[60%] rounded-3xl before:absolute before:left-8 before:top-8 before:h-full before:w-full before:rounded-3xl before:bg-gray-300 dark:before:bg-slate-900 before:shadow-xl before:content-[""] max-sm:w-full'>
            <iframe
              className="absolute inset-0 z-10 block h-full w-full rounded-xl"
              src={aboutContent.youtubeUrl}
              title={aboutContent.title}
              frameBorder={"none"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className="z-10 flex w-[40%] flex-col items-start gap-[15px] max-md:gap-3 max-sm:w-full">
            <h2 className="text-left text-[25px] font-bold max-md:text-xl text-gray-900 dark:text-white">{aboutContent.title}</h2>
            <p className="mb-1 text-[20px] font-normal max-md:text-lg text-gray-700 dark:text-gray-300">{aboutContent.subtitle}</p>
            <span className={"text-left leading-[1.8] max-md:text-base text-gray-600 dark:text-gray-300"}>
              {aboutContent.description}
            </span>
            <Link href={aboutContent.buttonUrl} target="_blank">
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success p-1 text-md rounded-sm bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                {aboutContent.buttonText}
              </button>
            </Link>
          </div>
        </div>
      </aside>
    </section>
  );
} 