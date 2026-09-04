import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { playSound, type SoundName } from "../services/soundEffects";

const STORAGE_KEY = "t-sound";

function initialEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== "0";
}

type SoundContextValue = {
  enabled: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  }, [enabled]);

  const toggleSound = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const play = useCallback(
    (sound: SoundName) => {
      if (enabled) playSound(sound);
    },
    [enabled],
  );

  return (
    <SoundContext.Provider value={{ enabled, toggleSound, play }}>{children}</SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
}
