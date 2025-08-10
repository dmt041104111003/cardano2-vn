import { useRef, useCallback, useEffect } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current && typeof window !== 'undefined') {
      try {
        audioRef.current = new Audio('/music/music.mp3');
        audioRef.current.preload = 'auto';
        audioRef.current.volume = 0.8;
        audioRef.current.load(); 
        isInitializedRef.current = true;
      } catch (error) {
        console.warn('Error initializing notification sound:', error);
      }
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/music/music.mp3');
        audioRef.current.preload = 'auto';
        audioRef.current.volume = 0.8;
      }

      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
          })
          .catch((error) => {
            console.warn('Failed to play notification sound:', error);
            try {
              const newAudio = new Audio('/music/music.mp3');
              newAudio.volume = 0.8;
              newAudio.play().catch((e) => {
                console.warn('Retry failed:', e);
              });
            } catch (e) {
              console.warn('Failed to create new audio:', e);
            }
          });
      }
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }, []);

  return {
    playNotificationSound,
  };
}
