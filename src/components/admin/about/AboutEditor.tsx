"use client";

import { useState } from "react";

interface AboutContent {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  youtubeUrl: string;
  buttonText: string;
  buttonUrl: string;
}

interface AboutEditorProps {
  initialData?: AboutContent;
  onSave: (data: AboutContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AboutEditor({ initialData, onSave, onCancel, isLoading }: AboutEditorProps) {
  const [formData, setFormData] = useState<AboutContent>({
    title: initialData?.title || "About Cardano2vn",
    subtitle: initialData?.subtitle || "Open source dynamic assets (Token/NFT) generator (CIP68)",
    description: initialData?.description || "Open source dynamic assets (Token/NFT) generator (CIP68) CIP68 Generator is a tool designed to simplify the creation, management, and burning of CIP68-compliant native assets on the Cardano platform. It provides an easy-to-use interface for non-technical users to interact with these assets while also offering open-source code for developers to integrate and deploy applications faster and more efficiently.",
    youtubeUrl: initialData?.youtubeUrl || "https://www.youtube.com/embed/_GrbIRoT3mU",
    buttonText: initialData?.buttonText || "Learn More Cardano2vn",
    buttonUrl: initialData?.buttonUrl || "https://cips.cardano.org/cip/CIP-68"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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
          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/_GrbIRoT3mU"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
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