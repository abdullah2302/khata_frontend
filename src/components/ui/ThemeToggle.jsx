import { useTheme } from '../../context/ThemeContext';

// Sun / moon button: switches between dark mode and the last light theme.
export default function ThemeToggle() {
  const { isDark, toggleDark } = useTheme();
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      onClick={toggleDark}
      aria-label={label}
      title={label}
      className="grid size-9 cursor-pointer place-items-center rounded-full border border-rule bg-card text-strong transition-transform hover:scale-105 active:scale-95"
    >
      <i key={String(isDark)} className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} animate-pop`} />
    </button>
  );
}