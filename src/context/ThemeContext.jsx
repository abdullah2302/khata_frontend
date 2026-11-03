import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  { id: 'notebook', label: 'Notebook', ink: '#14213d', paper: '#fcfbf7', margin: '#d9453c' },
  { id: 'ledger', label: 'Ledger', ink: '#123b34', paper: '#f6f8f0', margin: '#c23b2e' },
  { id: 'plum', label: 'Plum', ink: '#2d1b4e', paper: '#fbf8fd', margin: '#e0457b' }
];

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return THEMES.some((t) => t.id === saved) ? saved : 'notebook';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
