"use client";

import React from 'react';
import LandingContentManagerWrapper from './LandingContentManager';

interface LandingManageSectionProps {
  landingContents: any[];
  formData: {
    section: string;
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
    media1Url: string;
    media2Url: string;
    media3Url: string;
    media4Url: string;
    publishStatus: 'DRAFT' | 'PUBLISHED';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    section: string;
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
    media1Url: string;
    media2Url: string;
    media3Url: string;
    media4Url: string;
    publishStatus: 'DRAFT' | 'PUBLISHED';
  }>>;
}

export default function LandingManageSection({ landingContents, formData, setFormData }: LandingManageSectionProps) {
  return (
    <div className="w-full">
      <LandingContentManagerWrapper formData={formData} setFormData={setFormData} />
    </div>
  );
}
