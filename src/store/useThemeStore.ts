import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'purple' | 'green' | 'amber' | 'rose' | 'slate' | 'orange' | 'mint' | 'crimson';
export type FontFamily = 'inter' | 'outfit' | 'roboto' | 'playfair' | 'montserrat' | 'mono' | 'serif' | 'lora' | 'syne';

interface ThemeStore {
  mode: ThemeMode;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontFamily: (font: FontFamily) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      accentColor: 'blue',
      fontFamily: 'inter',
      setMode: (mode) => set({ mode }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
    }),
    {
      name: 'nexus-theme',
    }
  )
);
