import { Link } from 'react-router-dom';

const variants = {
  solid: 'bg-ink text-white hover:bg-ink-2',
  ghost: 'border border-ink/30 text-ink hover:bg-desk',
  light: 'bg-paper text-ink hover:bg-white',
  outlineLight: 'border border-paper/40 text-paper hover:bg-ink-2'
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
