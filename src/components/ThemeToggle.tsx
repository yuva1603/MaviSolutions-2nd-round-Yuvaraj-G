import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      localStorage.removeItem('theme');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="relative flex items-center gap-3">
      {theme !== 'system' && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:block">
          {theme} Mode
        </span>
      )}
      {theme === 'system' && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:block">
          System Mode
        </span>
      )}
      <button 
        onClick={cycleTheme}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105 shadow-sm"
        title={`Current: ${theme}. Click to change.`}
      >
        {theme === 'light' ? <Sun size={20} strokeWidth={2} /> : theme === 'dark' ? <Moon size={20} strokeWidth={2} /> : <Monitor size={20} strokeWidth={2} />}
      </button>
    </div>
  );
}
