import { THEMES, useTheme } from '../../context/ThemeContext';

// compact: small round swatches for the light themes (dark mode has its own toggle button).
// Otherwise: labelled cards for every theme, including Dark (settings page).
export default function ThemePicker({ compact = false }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <div role="radiogroup" aria-label="Light theme" className="flex items-center gap-2">
        {THEMES.filter((t) => !t.dark).map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={theme === t.id}
            aria-label={`${t.label} theme`}
            title={t.label}
            onClick={() => setTheme(t.id)}
            className={`size-6 cursor-pointer rounded-full border border-black/20 transition-transform hover:scale-110 ${
              theme === t.id ? 'ring-2 ring-gold ring-offset-2 ring-offset-paper' : ''
            }`}
            style={{ background: `linear-gradient(135deg, ${t.ink} 50%, ${t.margin} 50%)` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t.id)}
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-left transition-colors ${
              active ? 'border-strong bg-card ring-2 ring-gold' : 'border-rule hover:bg-card/60'
            }`}
          >
            <span className="flex h-9 w-12 shrink-0 overflow-hidden rounded border border-black/10" aria-hidden="true">
              <i className="flex-1" style={{ background: t.ink }} />
              <i className="flex-1" style={{ background: t.paper }} />
              <i className="w-2" style={{ background: t.margin }} />
            </span>
            <span className="font-semibold">{t.label}</span>
            {active && <i className="fa-solid fa-check ml-auto text-emerald-700" />}
          </button>
        );
      })}
    </div>
  );
}