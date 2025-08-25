"use client";

import { motion } from "framer-motion";
import MediaInput from "~/components/ui/media-input";
import { WelcomeModalData } from "~/constants/admin";
import WelcomeModalEditSkeleton from "./WelcomeModalEditSkeleton";

interface WelcomeModalEditProps {
  formData: WelcomeModalData;
  previewImage: string;
  onInputChange: (field: keyof WelcomeModalData, value: string) => void;
  onImageChange: (media: any) => void;
  onSave: () => void;
  isSaving: boolean;
  isLoading?: boolean;
}

export default function WelcomeModalEdit({ 
  formData, 
  previewImage, 
  onInputChange, 
  onImageChange, 
  onSave, 
  isSaving,
  isLoading
}: WelcomeModalEditProps) {
  if (isLoading) {
    return <WelcomeModalEditSkeleton />;
  }

  const maxDescriptionLength = 1200;
  const currentDescriptionLength = formData.description?.length || 0;
  const isDescriptionLimitReached = currentDescriptionLength >= maxDescriptionLength;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxDescriptionLength) {
      onInputChange('description', value);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange('startDate', value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      return;
    }
    onInputChange('endDate', value);
  };

  const isEndDateRequired = !formData.endDate;

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
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            Description
          </label>
          <span className={`text-xs ${
            isDescriptionLimitReached 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {currentDescriptionLength}/{maxDescriptionLength}
          </span>
        </div>
        <textarea
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Discover the power of Cardano blockchain technology..."
          maxLength={maxDescriptionLength}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-justify ${
            isDescriptionLimitReached 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            Start Date (Optional - auto set to now when save)
          </label>
          <input
            type="datetime-local"
            value={formData.startDate || ""}
            onChange={handleStartDateChange}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            title="Start Date"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            End Date *
          </label>
          <input
            type="datetime-local"
            value={formData.endDate || ""}
            onChange={handleEndDateChange}
            min={formData.startDate || new Date().toISOString().slice(0, 16)}
            required
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${
              isEndDateRequired 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            title="End Date (Required)"
          />
          {isEndDateRequired && (
            <span className="text-xs text-red-500 dark:text-red-400 text-center block">
              End date is required
            </span>
          )}
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Publish Status
        </label>
        <select
          value={formData.publishStatus}
          onChange={(e) => onInputChange('publishStatus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          title="Select publish status"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button 
          onClick={onSave}
          disabled={isSaving || isEndDateRequired}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 font-medium rounded-lg border border-blue-300 dark:border-blue-600 hover:bg-blue-400/30 dark:hover:bg-blue-400/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  );
}
