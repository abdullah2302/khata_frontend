const base =
  'w-full rounded-md border border-rule bg-white px-3 py-2.5 focus:border-ink focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:bg-desk/50';

export const Input = ({ label, ...props }) => (
  <label className="grid gap-1 text-sm font-medium">
    {label}
    <input {...props} className={base} />
  </label>
);

export const Textarea = ({ label, ...props }) => (
  <label className="grid gap-1 text-sm font-medium">
    {label}
    <textarea {...props} className={`${base} min-h-20 resize-y`} />
  </label>
);

export const Select = ({ label, children, ...props }) => (
  <label className="grid gap-1 text-sm font-medium">
    {label}
    <select {...props} className={base}>{children}</select>
  </label>
);

export const IconInput = ({ icon, ...props }) => (
  <label className="flex items-center gap-2.5 rounded-md border border-rule bg-white px-3 focus-within:border-ink focus-within:ring-2 focus-within:ring-gold/60">
    <i className={`fa-solid ${icon} text-muted`} />
    <input {...props} className="min-w-0 flex-1 bg-transparent py-3 outline-none" />
  </label>
);
