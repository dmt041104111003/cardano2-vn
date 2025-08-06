"use client";

import { motion } from "framer-motion";
import MediaInput from "~/components/ui/media-input";
import { WelcomeModalData } from "~/constants/admin";

interface WelcomeModalEditProps {
  formData: WelcomeModalData;
  previewImage: string;
  onInputChange: (field: keyof WelcomeModalData, value: string) => void;
  onImageChange: (media: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function WelcomeModalEdit({ 
  formData, 
  previewImage, 
  onInputChange, 
  onImageChange, 
  onSave, 
  isSaving 
}: WelcomeModalEditProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Welcome to Cardano2VN"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Image
        </label>
        <MediaInput
          onMediaAdd={onImageChange}
        />
        {previewImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">
              Preview
            </label>
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={() => onImageChange({ url: "" })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Discover the power of Cardano blockchain technology..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-justify"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            Start Date
          </label>
          <input
            type="datetime-local"
            value={formData.startDate || ""}
            onChange={(e) => onInputChange('startDate', e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            title="Start Date"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            End Date
          </label>
          <input
            type="datetime-local"
            value={formData.endDate || ""}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            min={formData.startDate || new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            title="End Date"
          />
        </div>
      </div>

      {/* Button Link */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Button Link
        </label>
        <input
          type="url"
          value={formData.buttonLink || ""}
          onChange={(e) => onInputChange('buttonLink', e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 font-medium rounded-lg border border-blue-300 dark:border-blue-600 hover:bg-blue-400/30 dark:hover:bg-blue-400/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  );
}
