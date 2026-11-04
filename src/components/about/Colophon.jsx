import Reveal from '../ui/Reveal';

const rows = [
  ['Built by', 'Abdullah'],
  ['Project', 'A MERN stack capstone'],
  ['Year', '2026'],
  ['Look', 'Ledger paper, ink and a red margin line']
];

export default function Colophon() {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(([k, v], i) => (
        <Reveal key={k} delay={i * 90} className="border-t-2 border-strong pt-3">
          <p className="text-sm text-muted">{k}</p>
          <p className="font-display text-xl font-semibold">{v}</p>
        </Reveal>
      ))}
    </div>
  );
}
