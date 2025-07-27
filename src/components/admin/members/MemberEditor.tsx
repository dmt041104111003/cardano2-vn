"use client";

import { useState, useRef } from "react";

interface Member {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  order: number;
}

interface MemberEditorProps {
  member?: Member;
  onSave: (data: Member) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface MediaInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
}

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
      if (response.ok && result.media?.url) {
        onChange(result.media.url);
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
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
          Paste URL
        </button>
      </div>
      
      {activeTab === 'upload' && (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 border border-blue-200"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </button>
          <input
            type="file"
            accept={accept || "image/*"}
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            title="Upload image file"
            aria-label="Upload image file"
          />
        </div>
      )}
      
      {activeTab === 'url' && (
        <div className="flex flex-col items-center gap-2 w-full">
          <input
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder || "Paste image URL here..."}
            value={imageUrl}
            onChange={e => handleImageUrl(e.target.value)}
          />
        </div>
      )}
      
      {value && (
        <div className="flex justify-center">
          <img
            src={value}
            alt="Preview"
            className="max-w-full max-h-48 rounded-lg shadow-md"
          />
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
    order: member?.order || 0
  });

  const [skillInput, setSkillInput] = useState("");

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
            placeholder="Upload or paste image URL"
            accept="image/*"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color Theme</label>
          <select
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {colorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">Display Order</label>
          <input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
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