import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useState } from 'react';

const ThemeSwitcherDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <div
      className={[
        'p-24 flex items-center justify-center',
        theme === 'dark' && 'dark bg-zinc-900',
        theme === 'light' && 'bg-white',
        theme === 'system' && 'bg-zinc-800'
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
          Theme Switcher
        </h2>
        <ThemeSwitcher value={theme} onChange={setTheme} />
        <p className={`mt-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Current theme: {theme}
        </p>
      </div>
    </div>
  );
};
  
export default ThemeSwitcherDemo;
