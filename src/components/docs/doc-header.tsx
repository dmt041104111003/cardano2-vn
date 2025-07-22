"use client";

import { Menu } from "lucide-react";

interface DocHeaderProps {
  onMenuClick?: () => void;
}

export default function DocHeader({ onMenuClick }: DocHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="p-4 lg:p-6">
        <div className="lg:hidden flex items-center justify-between mb-4">
          
          <button 
            className="p-2 text-gray-500 hover:text-gray-700" 
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
       
      </div>
    </div>
  );
} 