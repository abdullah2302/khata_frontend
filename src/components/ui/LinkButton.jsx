import { Link } from 'react-router-dom';

const variants = {
  solid: 'bg-ink text-white hover:bg-ink-2',
  ghost: 'border border-strong/30 text-strong hover:bg-desk',
  light: 'bg-white text-slate-900 hover:bg-white/90',
  outlineLight: 'border border-white/40 text-white hover:bg-white/10'
};

// Renders a router <Link> (pass `to`) or a plain anchor (pass `href`) styled as a button.
export default function LinkButton({ to, href, variant = 'solid', icon, children, className = '', ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-semibold transition-all active:scale-[0.98] ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon && <i className={icon.startsWith('fa-brands') ? icon : `fa-solid ${icon}`} />}
      {children}
    </>
  );
  return href ? (
    <a href={href} className={cls} {...props}>{content}</a>
  ) : (
    <Link to={to} className={cls} {...props}>{content}</Link>
  );
}