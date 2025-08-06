import React from 'react';

interface ContactFormImageProps {
  imageUrl: string;
}

export default function ContactFormImage({ imageUrl }: ContactFormImageProps) {
  if (!imageUrl) return null;
  return (
    <img
      src={imageUrl}
      alt="Course background"
      className="w-full h-full object-cover rounded-lg shadow opacity-80"
    />
  );
}