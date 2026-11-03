const levels = [
  { label: 'Too short', color: 'bg-margin' },
  { label: 'Weak', color: 'bg-margin' },
  { label: 'Fair', color: 'bg-gold' },
  { label: 'Good', color: 'bg-emerald-500' },
  { label: 'Strong', color: 'bg-emerald-700' }
];

// 0 = shorter than 6 characters, 1..4 = more length and variety
export const scorePassword = (p) => {
  if (p.length < 6) return 0;
  const extras = [p.length >= 10, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)];
  return Math.min(4, 1 + extras.filter(Boolean).length);
};

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const { label, color } = levels[score];
  return (
    <div className="animate-fade" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-desk">
            <span className={`block h-full origin-left rounded-full transition-all duration-500 ${color} ${n <= score ? 'scale-x-100' : 'scale-x-0'}`} />
          </span>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Password strength: {label}</p>
    </div>
  );
}
