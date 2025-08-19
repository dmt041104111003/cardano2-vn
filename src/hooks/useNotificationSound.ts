import { useCallback } from 'react';

export function useNotificationSound() {
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/music/music.mp3');
      audio.volume = 0.8;
      
      audio.play().catch((error) => {
        const playWithGesture = () => {
          audio.play().catch((retryError) => {
          });
          document.removeEventListener('click', playWithGesture);
        };

        document.addEventListener('click', playWithGesture, { once: true });
      });
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }, []);

  return {
    playNotificationSound,
  };
}
