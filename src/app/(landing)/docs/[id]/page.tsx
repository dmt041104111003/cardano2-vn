"use client";

import { useState } from "react";
import DocSidebar from "~/components/docs/doc-sidebar";
import DocContentComponent from "~/components/docs/doc-content";
import DocBreadcrumb from "~/components/docs/doc-breadcrumb";
import DocHeader from "~/components/docs/doc-header";
import { introductionContent } from "~/constants/docs";

export default function DocDetailPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <main className="relative pt-20">
      <div className="flex min-h-screen bg-white">
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        <div className={`fixed lg:relative z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <DocSidebar onClose={() => setIsMobileSidebarOpen(false)} />
        </div>
        
        <div className="flex-1 w-full">
          <DocHeader onMenuClick={toggleMobileSidebar} />
          <div className="px-4 lg:px-8 py-4 lg:py-6">
            <DocBreadcrumb
              items={[
                { label: "Documentation", href: "/docs" },
                { label: "New to Cardano?", href: "/docs/new-to-cardano" },
                { label: "Introduction" },
              ]}
            />
            
            <DocContentComponent content={introductionContent} />
          </div>
        </div>
      </div>
    </main>
  );
} 