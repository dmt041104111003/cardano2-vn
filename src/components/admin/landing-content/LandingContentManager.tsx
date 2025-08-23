"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import ContentSection from './ContentSection';
import MediaSection from './MediaSection';
import FormActions from './FormActions';

export default function LandingContentManager() {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    section: 'hero',
    title: '',
    subtitle: '',
    description: '',
    mainText: '',
    subText: '',
    media1Url: '',
    media2Url: '',
    media3Url: '',
    media4Url: ''
  });

  const { data: landingContents = [] } = useQuery({
    queryKey: ['landing-content'],
    queryFn: async () => {
      const response = await fetch('/api/admin/landing-content', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch landing content');
      }
      const data = await response.json();
      return data?.data || [];
    }
  });

  useEffect(() => {
    if (landingContents.length > 0) {
      const firstContent = landingContents[0];
      setFormData({
        section: firstContent.section || 'hero',
        title: firstContent.title || '',
        subtitle: firstContent.subtitle || '',
        description: firstContent.description || '',
        mainText: firstContent.mainText || '',
        subText: firstContent.subText || '',
        media1Url: firstContent.media1Url || '',
        media2Url: firstContent.media2Url || '',
        media3Url: firstContent.media3Url || '',
        media4Url: firstContent.media4Url || ''
      });
    }
  }, [landingContents]);

  const updateMutation = useMutation({
    mutationFn: async (data: {
      section: string;
      title?: string;
      subtitle?: string;
      description?: string;
      mainText?: string;
      subText?: string;
      media1Url?: string;
      media2Url?: string;
      media3Url?: string;
      media4Url?: string;
    }) => {
      const response = await fetch('/api/admin/landing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save landing content');
      }
      return response.json();
    },
    onSuccess: () => {
      showSuccess('Landing content saved successfully');
      queryClient.invalidateQueries({ queryKey: ['landing-content'] });
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before submit:', formData);
    
    const submitData = {
      section: formData.section,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      mainText: formData.mainText,
      subText: formData.subText,
    };

    if (formData.media1Url && formData.media1Url.trim()) {
      (submitData as any).media1Url = formData.media1Url;
    }
    if (formData.media2Url && formData.media2Url.trim()) {
      (submitData as any).media2Url = formData.media2Url;
    }
    if (formData.media3Url && formData.media3Url.trim()) {
      (submitData as any).media3Url = formData.media3Url;
    }
    if (formData.media4Url && formData.media4Url.trim()) {
      (submitData as any).media4Url = formData.media4Url;
    }

    console.log('Submit data:', submitData);
    updateMutation.mutate(submitData);
  };

  const handleMediaSelect = (media: { id: string; url: string; type: string }) => {
    console.log('Media selected:', media);
    
    const emptySlot = ['media1Url', 'media2Url', 'media3Url', 'media4Url'].find(
      field => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === ''
    );
    
    if (emptySlot) {
      setFormData(prev => ({
        ...prev,
        [emptySlot]: media.url
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        media4Url: media.url
      }));
    }
  };

  const handleRemoveMedia = (index: number) => {
    const mediaField = `media${index + 1}Url` as keyof typeof formData;
    setFormData(prev => ({
      ...prev,
      [mediaField]: ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          Landing Content Management
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <ContentSection formData={formData} setFormData={setFormData} />
            <MediaSection 
              formData={formData} 
              setFormData={setFormData}
              handleMediaSelect={handleMediaSelect}
              handleRemoveMedia={handleRemoveMedia}
            />
          </div>
          
          <FormActions isPending={updateMutation.isPending} />
        </form>
      </div>
    </div>
  );
} 