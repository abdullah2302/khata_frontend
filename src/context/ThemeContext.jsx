import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const THEMES = [
  { id: 'notebook', label: 'Notebook', ink: '#14213d', paper: '#fcfbf7', margin: '#d9453c' },
  { id: 'ledger', label: 'Ledger', ink: '#123b34', paper: '#f6f8f0', margin: '#c23b2e' },
  { id: 'plum', label: 'Plum', ink: '#2d1b4e', paper: '#fbf8fd', margin: '#e0457b' },
  { id: 'dark', label: 'Dark', ink: '#2c3e75', paper: '#151b2b', margin: '#ff6b61', dark: true }
];

const isTheme = (id) => THEMES.some((t) => t.id === id);

// The light theme to go back to when dark mode is switched off
const lastLightTheme = () => {
  const saved = localStorage.getItem('lightTheme');
  return isTheme(saved) && saved !== 'dark' ? saved : 'notebook';
};

// Saved choice first, otherwise follow the device's light/dark setting
const initialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (isTheme(saved)) return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'notebook';
};

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (theme !== 'dark') localStorage.setItem('lightTheme', theme);
  }, [theme]);

  const toggleDark = useCallback(() => setTheme((t) => (t === 'dark' ? lastLightTheme() : 'dark')), []);
  const value = useMemo(() => ({ theme, setTheme, isDark: theme === 'dark', toggleDark }), [theme, toggleDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}