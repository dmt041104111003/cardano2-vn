import React, { useState } from 'react';

interface ContactFormImageProps {
  imageUrl: string;
}

export default function ContactFormImage({ imageUrl }: ContactFormImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!imageUrl) return null;

  return (
    <>
      <img
        src={imageUrl}
        alt="Course background"
        className="w-full h-full object-cover rounded-lg shadow opacity-80 cursor-zoom-in hover:opacity-90 transition-opacity"
        onClick={() => setIsLightboxOpen(true)}
      />

      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto transparent-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <img 
                src={imageUrl} 
                alt="Course background" 
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg" 
              />
            </div>
          </div>

          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-8 right-8 w-16 h-16 border-none bg-black/20 rounded-lg transition-all hover:bg-black/40"
            style={{ zIndex: 50 }}
            aria-label="Close lightbox"
          >
            <span
              className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white transform -translate-x-1/2 rotate-45"
            ></span>
            <span
              className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white transform -translate-x-1/2 -rotate-45"
            ></span>
          </button>
        </div>
      )}
    </>
  );
}