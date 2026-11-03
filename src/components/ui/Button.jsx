import { Link } from 'react-router-dom';

const variants = {
  solid: 'bg-ink text-white hover:bg-ink-2',
  ghost: 'border border-rule hover:bg-desk'
};

export default function Button({ variant = 'solid', icon, children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 font-semibold transition-all active:scale-[0.98] disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {icon && <i className={icon.startsWith('fa-brands') ? icon : `fa-solid ${icon}`} />}
      {children}
    </button>
  );
}

const iconBase =
  'inline-block cursor-pointer rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-desk disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent';

export function IconButton({ icon, title, danger, ...props }) {
  return (
    <button {...props} title={title} aria-label={title} className={`${iconBase} ${danger ? 'hover:text-margin' : 'hover:text-ink'}`}>
      <i className={`fa-solid ${icon}`} />
    </button>
  );
}

export function IconLink({ to, icon, title }) {
  return (
    <Link to={to} title={title} aria-label={title} className={`${iconBase} hover:text-ink`}>
      <i className={`fa-solid ${icon}`} />
    </Link>
  );
}
