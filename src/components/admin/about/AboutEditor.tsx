"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AboutContent, AboutEditorProps } from "~/constants/about";

export default function AboutEditor({ onSave, onCancel, isLoading }: AboutEditorProps) {
  const [formData, setFormData] = useState<AboutContent>({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    youtubeUrl: "",
    buttonText: "",
    buttonUrl: "",
    isActive: true,
    createdAt: "",
    updatedAt: ""
  });

  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return url;
  };

  const { data: aboutData, isLoading: loadingAbout } = useQuery({
    queryKey: ['admin-about'],
    queryFn: async () => {
      const res = await fetch('/api/admin/about', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch about data');
      return res.json();
    }
  });

  useEffect(() => {
    if (aboutData?.data) {
      setFormData(aboutData.data);
    }
  }, [aboutData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loadingAbout) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="About Cardano2vn"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input
            id="subtitle"
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Open source dynamic assets (Token/NFT) generator (CIP68)"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description..."
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">YouTube URL</label>
        <input
          id="youtubeUrl"
          type="text"
          value={formData.youtubeUrl}
          onChange={(e) => {
            const inputValue = e.target.value;
            const embedUrl = convertToEmbedUrl(inputValue);
            setFormData({ ...formData, youtubeUrl: embedUrl });
          }}
          onBlur={(e) => {
            const inputValue = e.target.value;
            const embedUrl = convertToEmbedUrl(inputValue);
            if (embedUrl !== inputValue) {
              setFormData({ ...formData, youtubeUrl: embedUrl });
            }
          }}
          placeholder="https://www.youtube.com/watch?v=_GrbIRoT3mU or https://youtu.be/_GrbIRoT3mU"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formData.youtubeUrl && !formData.youtubeUrl.includes('youtube.com/embed/') && (
          <p className="text-sm text-gray-500">URL will be automatically converted to embed URL when you leave the input field</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            id="buttonText"
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            placeholder="Learn More Cardano2vn"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700">Button URL</label>
          <input
            id="buttonUrl"
            type="text"
            value={formData.buttonUrl}
            onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
            placeholder="https://cips.cardano.org/cip/CIP-68"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
} 