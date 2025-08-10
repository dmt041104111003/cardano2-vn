"use client";

import { useEffect, useRef } from 'react';

export function AudioInitializer() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;

    const initializeAudio = () => {
      try {
        const audio = new Audio('/music/music.mp3');
        audio.volume = 0;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {
        });
        
        isInitializedRef.current = true;
        document.removeEventListener('click', initializeAudio);
        document.removeEventListener('keydown', initializeAudio);
        document.removeEventListener('touchstart', initializeAudio);
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    document.addEventListener('click', initializeAudio, { once: true });
    document.addEventListener('keydown', initializeAudio, { once: true });
    document.addEventListener('touchstart', initializeAudio, { once: true });

    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('keydown', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    };
  }, []);

  return null;
}
