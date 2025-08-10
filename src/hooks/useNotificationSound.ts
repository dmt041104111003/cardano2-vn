import { useRef, useCallback } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/music/music.mp3');
      audio.volume = 0.8;
      audio.play().catch((error) => {
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
