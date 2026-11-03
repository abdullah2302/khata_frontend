// Replace each url with your own profile link.
const socials = [
  { name: 'Facebook', icon: 'fa-facebook-f', color: '#1877F2', url: 'https://facebook.com/' },
  { name: 'X', icon: 'fa-x-twitter', color: '#000000', url: 'https://x.com/' },
  { name: 'Instagram', icon: 'fa-instagram', color: '#E1306C', url: 'https://instagram.com/' },
  { name: 'LinkedIn', icon: 'fa-linkedin-in', color: '#0A66C2', url: 'https://linkedin.com/' },
  { name: 'GitHub', icon: 'fa-github', color: '#181717', url: 'https://github.com/' },
  { name: 'YouTube', icon: 'fa-youtube', color: '#FF0000', url: 'https://youtube.com/' },
  { name: 'WhatsApp', icon: 'fa-whatsapp', color: '#25D366', url: 'https://wa.me/' }
];

// White tiles keep every brand colour visible (even black X and GitHub) on the dark footer.
// On hover the tile fills with the brand colour.
export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Social media">
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            style={{ '--brand': s.color }}
            className="grid size-10 place-items-center rounded-lg bg-white text-lg text-[var(--brand)] transition-all hover:-translate-y-1 hover:bg-[var(--brand)] hover:text-white"
          >
            <i className={`fa-brands ${s.icon}`} />
          </a>
        </li>
      ))}
    </ul>
  );
}
