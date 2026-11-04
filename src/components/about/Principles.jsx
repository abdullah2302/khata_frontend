import Reveal from '../ui/Reveal';

const items = [
  { icon: 'fa-lock', title: 'Private by default', text: 'Your clients and invoices are visible to you alone.' },
  { icon: 'fa-scale-balanced', title: 'Honest numbers', text: 'Every total is calculated from invoices you recorded. Nothing is estimated.' },
  { icon: 'fa-bolt', title: 'Quick to use', text: 'Record an invoice in seconds and mark it paid with one click.' },
  { icon: 'fa-box-open', title: 'Yours to take', text: 'Export your data as CSV whenever you like.' }
];

export default function Principles() {
  return (
    <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p, i) => (
        <Reveal key={p.title} delay={i * 90} className="border-t-2 border-strong pt-4">
          <i className={`fa-solid ${p.icon} text-2xl`} />
          <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
          <p className="text-muted">{p.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
