import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const countdownAudioRef = useRef(null);
  const resultAudioRef = useRef(null);
  const countdownPlayCountRef = useRef(0);
  const countdownTimeoutRef = useRef(null);
  const hasPlayedResultRef = useRef(false);
  
  const playResultAudio = useCallback(() => {
    console.log('🔊 Attempting to play result audio', { isMuted, isInitialized, hasPlayedResult: hasPlayedResultRef.current });
    
    if (!isMuted && resultAudioRef.current && isInitialized && !hasPlayedResultRef.current) {
      hasPlayedResultRef.current = true;
      resultAudioRef.current.currentTime = 0;
      resultAudioRef.current.play()
        .then(() => {
          console.log('🔊 Result audio started successfully');
        })
        .catch(error => {
          console.error('🔊 Error playing result audio:', error);
        });
    } else if (hasPlayedResultRef.current) {
      console.log('🔊 Result audio already played, skipping');
    }
  }, [isMuted, isInitialized]);

  useEffect(() => {
    // Initialize audio elements with correct paths
    countdownAudioRef.current = new Audio('/countdown.mp3');
    resultAudioRef.current = new Audio('/result.mp3');
    
    // Set audio properties
    countdownAudioRef.current.preload = 'auto';
    resultAudioRef.current.preload = 'auto';
    countdownAudioRef.current.volume = 0.7;
    resultAudioRef.current.volume = 0.7;
    
    // Set up event listeners
    const handleCountdownEnd = () => {
      console.log('🔊 Countdown ended, play count:', countdownPlayCountRef.current);
      
      // If we haven't played 4 times yet, play again
      if (countdownPlayCountRef.current < 4) {
        countdownPlayCountRef.current++;
        console.log('🔊 Playing countdown again, count:', countdownPlayCountRef.current);
        
        // Small delay between plays
        countdownTimeoutRef.current = setTimeout(() => {
          if (countdownAudioRef.current && !isMuted) {
            countdownAudioRef.current.currentTime = 0;
            countdownAudioRef.current.play()
              .then(() => {
                console.log('🔊 Countdown repeat played successfully');
              })
              .catch(error => {
                console.error('🔊 Error repeating countdown audio:', error);
              });
          }
        }, 300);
      } else {
        // After 5 plays, countdown sequence is complete
        console.log('🔊 All countdowns completed');
        // Don't play result audio here - let the component handle it when results arrive
      }
    };
    
    const handleLoadedData = () => {
      console.log('🔊 Audio files loaded successfully');
      setIsInitialized(true);
    };
    
    countdownAudioRef.current.addEventListener('ended', handleCountdownEnd);
    countdownAudioRef.current.addEventListener('loadeddata', handleLoadedData);
    
    // Handle audio loading errors
    const handleError = (e) => {
      console.error('🔊 Audio loading error:', e);
    };
    
    countdownAudioRef.current.addEventListener('error', handleError);
    resultAudioRef.current.addEventListener('error', handleError);
    
    return () => {
      // Clear timeout on cleanup
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
      }
      
      if (countdownAudioRef.current) {
        countdownAudioRef.current.removeEventListener('ended', handleCountdownEnd);
        countdownAudioRef.current.removeEventListener('loadeddata', handleLoadedData);
        countdownAudioRef.current.removeEventListener('error', handleError);
      }
      if (resultAudioRef.current) {
        resultAudioRef.current.removeEventListener('error', handleError);
      }
    };
  }, [isMuted, isInitialized, playResultAudio]);

  const playCountdownAudio = useCallback(() => {
    console.log('🔊 Attempting to play countdown audio', { isMuted, isInitialized });
    
    if (!isMuted && countdownAudioRef.current && isInitialized) {
      // Reset the play count when starting a new countdown sequence
      countdownPlayCountRef.current = 1;
      // Reset result audio flag for new countdown sequence
      hasPlayedResultRef.current = false;
      
      // Clear any existing timeout
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
      }
      
      countdownAudioRef.current.currentTime = 0;
      countdownAudioRef.current.play()
        .then(() => {
          console.log('🔊 Countdown audio started successfully, play count:', countdownPlayCountRef.current);
        })
        .catch(error => {
          console.error('🔊 Error playing countdown audio:', error);
        });
    }
  }, [isMuted, isInitialized]);

  const stopAllAudio = () => {
    console.log('🔊 Stopping all audio');
    
    // Clear any pending timeouts
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
    }
    
    // Reset play count and result flag
    countdownPlayCountRef.current = 0;
    hasPlayedResultRef.current = false;
    
    if (countdownAudioRef.current) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
    }
    if (resultAudioRef.current) {
      resultAudioRef.current.pause();
      resultAudioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMuted = !prev;
      console.log('🔊 Toggling mute:', newMuted);
      if (newMuted) stopAllAudio();
      return newMuted;
    });
  };

  return (
    <AudioContext.Provider value={{
      isMuted,
      isInitialized,
      playCountdownAudio,
      playResultAudio,
      stopAllAudio,
      toggleMute,
    }}>
      {children}
    </AudioContext.Provider>
  );
};