import { createContext, useCallback, useContext, useState } from "react";

type PlayingAudioContextValue = {
  playingId: string | null;
  setPlaying: (messageId: string, element: HTMLAudioElement) => void;
  stop: (messageId: string) => void;
};

const PlayingAudioContext = createContext<PlayingAudioContextValue | null>(null);

export function PlayingAudioProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<{ id: string; el: HTMLAudioElement } | null>(null);

  const setPlaying = useCallback((messageId: string, element: HTMLAudioElement) => {
    setCurrent((prev) => {
      if (prev && prev.id !== messageId) {
        try {
          prev.el.pause();
        } catch {
          /* ignore */
        }
      }
      return { id: messageId, el: element };
    });
  }, []);

  const stop = useCallback((messageId: string) => {
    setCurrent((prev) => {
      if (prev?.id === messageId) return null;
      return prev;
    });
  }, []);

  const value: PlayingAudioContextValue = {
    playingId: current?.id ?? null,
    setPlaying,
    stop,
  };

  return (
    <PlayingAudioContext.Provider value={value}>
      {children}
    </PlayingAudioContext.Provider>
  );
}

export function usePlayingAudio() {
  const ctx = useContext(PlayingAudioContext);
  return ctx;
}
