"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Member, Tab, MemberEditorProps, MediaInputProps } from "~/constants/members";

function MediaInput({ value, onChange, placeholder, accept }: MediaInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log('MemberEditor upload response:', result);
      
      if (response.ok && result.data?.media?.url) {
        onChange(result.data.media.url);
      } else {
        console.error('Upload failed:', result);
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload error');
    }
  };

  const handleImageUrl = async (url: string) => {
    setImageUrl(url);
    if (!url) return;
    
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'IMAGE' }),
      });
      
      const result = await response.json();
      if (response.ok && result.media?.url) {
        onChange(result.media.url);
      } else {
        alert(result.error || 'Failed to add image URL');
      }
    } catch (err) {
      alert('Error adding image URL');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className={`px-3 py-1 rounded-t border-b-2 ${
            activeTab === 'upload' 
              ? 'border-blue-500 text-blue-600 bg-white' 
              : 'border-transparent text-gray-500 bg-gray-50'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-t border-b-2 ${
            activeTab === 'url' 
              ? 'border-blue-500 text-blue-600 bg-white' 
              : 'border-transparent text-gray-500 bg-gray-50'
          }`}
          onClick={() => setActiveTab('url')}
        >
          URL
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || "image/*"}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            Choose File
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => handleImageUrl(imageUrl)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add URL
          </button>
        </div>
      )}

      {value && (
        <div className="mt-4">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default function MemberEditor({ member, onSave, onCancel, isLoading }: MemberEditorProps) {
  const [formData, setFormData] = useState<Member>({
    name: member?.name || "",
    role: member?.role || "",
    description: member?.description || "",
    image: member?.image || "",
    email: member?.email || "",
    color: member?.color || "blue",
    skills: member?.skills || [],
    publishStatus: member?.publishStatus || "DRAFT",
    order: member?.order || 0,
    tabId: member?.tabId || ""
  });

  const [skillInput, setSkillInput] = useState("");

  // Fetch tabs for dropdown
  const { data: tabsData } = useQuery({
    queryKey: ['admin-tabs'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tabs');
      if (!res.ok) throw new Error('Failed to fetch tabs');
      return res.json();
    }
  });

  const tabs: Tab[] = tabsData?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "pink", label: "Pink" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "cyan", label: "Cyan" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Member name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input
            id="role"
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Member role"
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
          placeholder="Member description"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          <MediaInput
            value={formData.image}
            onChange={handleImageUpload}
            placeholder="Upload or enter image URL"
            accept="image/*"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="member@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order</label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tab" className="block text-sm font-medium text-gray-700">Tab</label>
          <Select
            value={formData.tabId || "no-tab"}
            onValueChange={(value) => setFormData({ ...formData, tabId: value === "no-tab" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a tab (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-tab">No Tab</SelectItem>
              {tabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  {tab.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="publishStatus" className="block text-sm font-medium text-gray-700">Publish Status</label>
        <select
          id="publishStatus"
          value={formData.publishStatus}
          onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value as 'DRAFT' | 'PUBLISHED' })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          title="Select publish status"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        {formData.skills && formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
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
          {isLoading ? 'Saving...' : (member ? 'Update Member' : 'Create Member')}
        </button>
      </div>
    </form>
  );
} 