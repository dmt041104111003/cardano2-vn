import React from "react";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
);

export default function CTALoadingGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <SkeletonBox className="lg:w-[70%] h-80" />
        <SkeletonBox className="lg:w-[30%] h-80" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col sm:flex-row gap-6 lg:w-[70%]">
          <SkeletonBox className="sm:w-1/2 h-80" />
          <SkeletonBox className="sm:w-1/2 h-80" />
        </div>
        <div className="flex flex-col gap-6 lg:w-[30%]">
          <SkeletonBox className="h-37" />
          <SkeletonBox className="h-37" />
        </div>
      </div>
    </div>
  );
}
