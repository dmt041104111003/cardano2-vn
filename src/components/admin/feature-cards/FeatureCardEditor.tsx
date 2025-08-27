"use client";

import { useState, useEffect } from "react";
import { FeatureCard, FeatureCardEditorProps, iconOptions } from "~/constants/feature-cards";
import { useToastContext } from "~/components/toast-provider";

export default function FeatureCardEditor({ featureCard, onSave, onCancel }: FeatureCardEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "Learn",
    order: 0,
    publishStatus: "DRAFT" as 'DRAFT' | 'PUBLISHED'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToastContext();

  useEffect(() => {
    if (featureCard) {
      setFormData({
        title: featureCard.title,
        description: featureCard.description,
        iconName: featureCard.iconName,
        order: featureCard.order,
        publishStatus: featureCard.publishStatus
      });
    }
  }, [featureCard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      showError('Description is required');
      return;
    }
    
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
            placeholder="Feature card title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order</label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="Display order"
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
          placeholder="Feature card description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="iconName" className="block text-sm font-medium text-gray-700">Icon</label>
        <select
          id="iconName"
          value={formData.iconName}
          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {iconOptions.map((icon) => (
            <option key={icon.value} value={icon.value}>
              {icon.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="publishStatus" className="block text-sm font-medium text-gray-700">Publish Status</label>
        <select
          id="publishStatus"
          value={formData.publishStatus}
          onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value as 'DRAFT' | 'PUBLISHED' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Saving...' : (featureCard ? 'Update Feature Card' : 'Create Feature Card')}
        </button>
      </div>
    </form>
  );
}
