import { useState, useEffect, useRef, useCallback } from 'react';
import { ComicPanel, NovelChapter } from '../types/novel';

export interface UsePanelNarratorReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  speed: number;
  availableSpeeds: number[];
  setSpeed: (speed: number) => void;
  cycleSpeed: () => void;
  playNarration: () => void;
  pauseNarration: () => void;
  resumeNarration: () => void;
  togglePlayPause: () => void;
  stopNarration: () => void;
  voiceName: string;
}

export const usePanelNarrator = (
  panel: ComicPanel,
  chapter: NovelChapter,
  currentPanelIndex: number
): UsePanelNarratorReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeedState] = useState<number>(1.0);
  const [voiceName, setVoiceName] = useState<string>('Default System Voice');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const availableSpeeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
        ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
          setVoiceName(preferredVoice.name);
        }
      };

      updateVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoice;
      }
    }
  }, []);

  // Construct narration text script from current panel
  const compilePanelScript = useCallback((): string => {
    const parts: string[] = [];

    // Header context
    parts.push(`${chapter.act}. ${panel.title}.`);

    if (panel.ambientCondition) {
      parts.push(`Ambient condition: ${panel.ambientCondition}.`);
    }

    if (panel.narrativeCaption) {
      parts.push(panel.narrativeCaption);
    }

    if (panel.dialogue && panel.dialogue.length > 0) {
      panel.dialogue.forEach((d) => {
        parts.push(`${d.speaker} says: "${d.text}"`);
      });
    }

    if (panel.quote) {
      parts.push(`Engineering quote: "${panel.quote}"`);
    }

    if (panel.soundEffect) {
      parts.push(`Sound effect: ${panel.soundEffect}.`);
    }

    return parts.join(' ');
  }, [chapter.act, panel]);

  // Stop narration on unmount or panel change
  const stopNarration = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  // When panel changes, stop any previous narration
  useEffect(() => {
    stopNarration();
  }, [panel.id, currentPanelIndex, stopNarration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playNarration = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const script = compilePanelScript();
    const utterance = new SpeechSynthesisUtterance(script);
    utteranceRef.current = utterance;

    utterance.rate = speed;
    utterance.pitch = 1.0;

    // Select suitable English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('David'))
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      setVoiceName(preferredVoice.name);
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      // Don't flag error if user cancelled intentionally
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [compilePanelScript, speed]);

  const pauseNarration = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeNarration = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!isSpeaking) {
      playNarration();
    } else if (isPaused) {
      resumeNarration();
    } else {
      pauseNarration();
    }
  }, [isSpeaking, isPaused, playNarration, resumeNarration, pauseNarration]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    // If speaking, restart at new speed
    if (isSpeaking && !isPaused) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Slight delay to restart smoothly
        setTimeout(() => {
          const script = compilePanelScript();
          const utterance = new SpeechSynthesisUtterance(script);
          utteranceRef.current = utterance;
          utterance.rate = newSpeed;
          utterance.pitch = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('David'))
          ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

          if (preferredVoice) utterance.voice = preferredVoice;

          utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            utteranceRef.current = null;
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            utteranceRef.current = null;
          };

          window.speechSynthesis.speak(utterance);
        }, 80);
      }
    }
  }, [isSpeaking, isPaused, compilePanelScript]);

  const cycleSpeed = useCallback(() => {
    const currentIdx = availableSpeeds.indexOf(speed);
    const nextIdx = (currentIdx + 1) % availableSpeeds.length;
    setSpeed(availableSpeeds[nextIdx]);
  }, [speed, availableSpeeds, setSpeed]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    speed,
    availableSpeeds,
    setSpeed,
    cycleSpeed,
    playNarration,
    pauseNarration,
    resumeNarration,
    togglePlayPause,
    stopNarration,
    voiceName
  };
};
