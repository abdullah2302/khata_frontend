import { useState } from 'react';

// Text input with a leading icon. The icon and ring react to focus.
export default function AuthField({ icon, right, ...props }) {
  return (
    <label className="group flex items-center gap-3 rounded-lg border border-rule bg-white px-3.5 transition-all duration-200 focus-within:border-ink focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-gold)_35%,transparent)]">
      <i className={`fa-solid ${icon} w-4 text-center text-muted transition-colors group-focus-within:text-ink`} />
      <input {...props} className="min-w-0 flex-1 bg-transparent py-3.5 outline-none" />
      {right}
    </label>
  );
}

export function PasswordField(props) {
  const [show, setShow] = useState(false);
  return (
    <AuthField
      icon="fa-lock"
      type={show ? 'text' : 'password'}
      right={
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="cursor-pointer text-muted transition-colors hover:text-ink"
        >
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
      }
      {...props}
    />
  );
}
