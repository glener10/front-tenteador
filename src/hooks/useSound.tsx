import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { playSound, type SoundName } from "../services/soundEffects";

const STORAGE_KEY = "t-sound";

// Buttons that already play their own sound (score +/- and truco/envido/etc.)
// or that are settings toggles must not also play the menu click.
const SKIP_SELECTOR = ".t-ctrl, .t-aux, .t-block, .t-flor, [data-sound='none']";

function initialEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1";
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

  useEffect(() => {
    if (!enabled) return;
    // ponytail: delegated menu click so every button (filters, back, close,
    // match rows, tabs...) gets the sound without wiring each handler.
    const onClick = (event: MouseEvent) => {
      const origin = event.target instanceof Element ? event.target : null;
      if (!(origin instanceof Element)) return;
      const button = origin.closest("button");
      if (!button || button.disabled || button.matches(SKIP_SELECTOR)) return;
      playSound("menu");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);

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
