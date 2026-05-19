'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode, accentColor, fontFamily } = useThemeStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // ⛔ Don't touch the DOM on client portal routes — the portal layout
    //    manages its own per-project theme via a separate useEffect.
    if (pathname?.startsWith('/client/')) return;

    const root = window.document.documentElement;
    
    // Apply Mode
    if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply Accent
    root.setAttribute('data-accent', accentColor);

    // Apply Font Variable for Editor and other components
    const fontMap: Record<string, string> = {
      inter: 'var(--font-inter)',
      outfit: 'var(--font-outfit)',
      roboto: 'var(--font-roboto)',
      playfair: 'var(--font-playfair)',
      montserrat: 'var(--font-montserrat)',
      mono: 'var(--font-jetbrains)',
      serif: 'var(--font-playfair)',
    };
    
    const primaryFont = `${fontMap[fontFamily] || 'var(--font-inter)'}, sans-serif`;
    root.style.setProperty('--font-primary', primaryFont);
    root.style.fontFamily = primaryFont;
    
    if (fontFamily === 'mono') {
      root.style.setProperty('--font-mono', 'var(--font-jetbrains), monospace');
    }

    // Apply Font Classes for Tailwind
    document.body.classList.remove('font-inter', 'font-outfit', 'font-roboto', 'font-playfair', 'font-montserrat', 'font-mono', 'font-serif');
    document.body.classList.add(`font-${fontFamily}`);
    
  }, [mode, accentColor, fontFamily, mounted, pathname]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
