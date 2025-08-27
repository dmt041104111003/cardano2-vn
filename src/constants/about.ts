import React from 'react';

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  youtubeUrl: string;
  buttonText: string;
  buttonUrl: string;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutEditorProps {
  onSave: (content: AboutContent) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Technology Components Interfaces
export interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
  githubRepo?: string;
  featureCardIds?: string[];
}

export interface TechnologyItemProps {
  technology: Technology;
}

export interface FeatureCard {
  id: string;
  Icon: () => React.ReactElement;
  title: string;
  description: string;
  color: string;
} 