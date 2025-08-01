"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Tab {
  id?: string;
  name: string;
  order: number;
}

interface TabEditorProps {
  tab?: Tab;
  onSave: (data: Tab) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TabEditor({ tab, onSave, onCancel, isLoading }: TabEditorProps) {
  const [formData, setFormData] = useState({
    name: tab?.name || '',
    order: tab?.order || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tab name is required';
    }

    if (formData.order < 0) {
      newErrors.order = 'Order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      order: formData.order
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tab Name *</label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter tab name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order</label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            className={errors.order ? 'border-red-500' : ''}
          />
          {errors.order && (
            <p className="text-sm text-red-500 mt-1">{errors.order}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (tab ? 'Update Tab' : 'Create Tab')}
        </Button>
      </div>
    </form>
  );
} 