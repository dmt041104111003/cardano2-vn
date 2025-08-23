"use client";

import React from 'react';
import LandingContentManagerWrapper from './LandingContentManager';

interface LandingManageSectionProps {
  landingContents: any[];
}

export default function LandingManageSection({ landingContents }: LandingManageSectionProps) {
  return (
    <div className="w-full">
      <LandingContentManagerWrapper />
    </div>
  );
}
