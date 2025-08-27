"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MediaInput from "~/components/ui/media-input";
import { Technology, TechnologyEditorProps } from "~/constants/technologies";
import { FeatureCard } from "~/constants/feature-cards";

export default function TechnologyEditor({ technology, onSave, onCancel }: TechnologyEditorProps) {
  const [title, setTitle] = useState(technology?.title || "");
  const [name, setName] = useState(technology?.name || "");
  const [description, setDescription] = useState(technology?.description || "");
  const [href, setHref] = useState(technology?.href || "");
  const [image, setImage] = useState(technology?.image || "");
  const [githubRepo, setGithubRepo] = useState(technology?.githubRepo || "");
  const [publishStatus, setPublishStatus] = useState(technology?.publishStatus || "DRAFT");
  const [selectedFeatureCardIds, setSelectedFeatureCardIds] = useState<string[]>(technology?.featureCardIds || []);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available feature cards
  const {
    data: featureCardsData,
    isLoading: loadingFeatureCards,
  } = useQuery({
    queryKey: ['admin-feature-cards'],
    queryFn: async () => {
      const res = await fetch('/api/admin/feature-cards', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch feature cards');
      return res.json();
    }
  });

  const featureCards: FeatureCard[] = featureCardsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !name.trim() || !description.trim() || !href.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        title: title.trim(),
        name: name.trim(),
        description: description.trim(),
        href: href.trim(),
        image: image.trim(),
        githubRepo: githubRepo.trim(),
        publishStatus: publishStatus,
        featureCardIds: selectedFeatureCardIds,
      });
    } catch (error) {
      console.error('Error saving technology:', error);
      alert('Failed to save technology');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter technology title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter technology name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publish Status *
          </label>
          <select
            value={publishStatus}
            onChange={(e) => setPublishStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
            title="Select publish status"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter technology description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link *
          </label>
          <input
            type="url"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <MediaInput
            mediaType="image"
            onMediaAdd={(media) => setImage(media.url)}
          />
          {image && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Selected:</p>
                  <p className="text-sm text-gray-900 truncate" title={image}>
                    {truncateUrl(image)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(image)}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Copy URL"
                  disabled={isSubmitting}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GitHub Repository (Optional)
        </label>
        <input
          type="text"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          placeholder="Enter GitHub repository (e.g., dmt041104111003/cardano2-vn)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          This will add a GitHub star widget to the technology page
        </p>
      </div>

      {/* Feature Cards Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feature Cards (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Select feature cards to display with this technology
        </p>
        
        {loadingFeatureCards ? (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : featureCards.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
            No feature cards available. Create some feature cards first.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
            {featureCards.map((featureCard) => (
              <label key={featureCard.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFeatureCardIds.includes(featureCard.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFeatureCardIds([...selectedFeatureCardIds, featureCard.id]);
                    } else {
                      setSelectedFeatureCardIds(selectedFeatureCardIds.filter(id => id !== featureCard.id));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{featureCard.title}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      featureCard.publishStatus === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {featureCard.publishStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{featureCard.description}</p>
                </div>
              </label>
            ))}
          </div>
        )}
        
        {selectedFeatureCardIds.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {selectedFeatureCardIds.length} feature card{selectedFeatureCardIds.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (technology ? "Update" : "Create") + " Technology"}
        </button>
      </div>
    </form>
  );
} 