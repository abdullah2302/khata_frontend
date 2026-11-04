import Reveal from '../ui/Reveal';

const people = [
  { icon: 'fa-code', label: 'Developers' },
  { icon: 'fa-pen-ruler', label: 'Designers' },
  { icon: 'fa-feather-pointed', label: 'Writers' },
  { icon: 'fa-chalkboard-user', label: 'Tutors' },
  { icon: 'fa-briefcase', label: 'Consultants' },
  { icon: 'fa-people-group', label: 'Small agencies' }
];

export default function Audience() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Made for people who bill by the project</h2>
          <p className="mt-2 max-w-xl text-muted">
            If you invoice clients yourself and want a straight answer to who still owes you, Khata is for you.
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-3">
          {people.map((p, i) => (
            <Reveal key={p.label} delay={i * 70}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-strong/20 bg-card/60 px-5 py-2.5 font-semibold transition-transform hover:-translate-y-0.5">
                <i className={`fa-solid ${p.icon} text-strong`} />
                {p.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
