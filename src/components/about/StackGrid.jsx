import Reveal from '../ui/Reveal';

const stack = [
  { icon: 'fa-brands fa-react', name: 'React', role: 'Interface and routing' },
  { icon: 'fa-solid fa-wind', name: 'Tailwind CSS', role: 'Styling' },
  { icon: 'fa-brands fa-node-js', name: 'Node.js', role: 'Runtime' },
  { icon: 'fa-solid fa-server', name: 'Express', role: 'API and routes' },
  { icon: 'fa-solid fa-database', name: 'MongoDB', role: 'Data and aggregations' },
  { icon: 'fa-brands fa-font-awesome', name: 'Font Awesome', role: 'Icons' }
];

export default function StackGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {stack.map((s, i) => (
        <Reveal key={s.name} delay={(i % 3) * 90}>
          <div className="h-full rounded-md border border-rule bg-white/60 p-5 transition-all hover:-translate-y-1 hover:shadow-md">
            <i className={`${s.icon} text-3xl text-ink`} />
            <p className="mt-3 font-display text-lg font-semibold">{s.name}</p>
            <p className="text-sm text-muted">{s.role}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
