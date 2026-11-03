import Reveal from '../ui/Reveal';

const steps = [
  { title: 'Add a client', text: 'Save who you are working for.' },
  { title: 'Create a project', text: 'Attach it to the client with a budget and a deadline.' },
  { title: 'Record an invoice', text: 'Enter the amount and the due date. Overdue invoices are flagged for you.' },
  { title: 'Mark it paid', text: 'When the money arrives, one click moves it into your earnings.' }
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">From first client to paid invoice</h2>
        </Reveal>
        <ol className="mt-8 border-t-2 border-ink">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <li className="grid grid-cols-[40px_1fr] items-baseline gap-x-4 gap-y-1 border-b border-rule py-5 md:grid-cols-[40px_240px_1fr]">
                <span className="font-display text-2xl font-extrabold text-margin">{i + 1}</span>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="text-muted max-md:col-start-2">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
