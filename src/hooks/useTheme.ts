import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored theme preference or default to 'system'
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      return storedTheme || 'system';
    }
    return 'system';
  });

  // Update theme class on document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mqListener = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', mqListener);
    
    return () => {
      mq.removeEventListener('change', mqListener);
    };
  }, [theme]);

  return { theme, setTheme };
}

export default useTheme;
