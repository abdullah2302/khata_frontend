import Reveal from '../ui/Reveal';

const old = ['Chat threads', 'Scattered spreadsheets', 'Remembering'];

export default function Replaces() {
  return (
    <div>
      <p className="mb-3 text-muted">Khata replaces</p>
      <div className="grid gap-1">
        {old.map((o, i) => (
          <Reveal key={o} delay={i * 120}>
            <span className="font-display text-4xl font-semibold tracking-tight text-muted line-through decoration-margin decoration-[3px] max-md:text-2xl">
              {o}
            </span>
          </Reveal>
        ))}
        <Reveal delay={480}>
          <span className="font-display text-5xl font-extrabold tracking-tight max-md:text-3xl">One ledger.</span>
        </Reveal>
      </div>
    </div>
  );
}
