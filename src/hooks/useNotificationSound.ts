import { useRef, useCallback } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/music/music.mp3');
        audioRef.current.preload = 'auto';
        audioRef.current.volume = 0.8; 
      }

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }, []);

  return {
    playNotificationSound,
  };
}
