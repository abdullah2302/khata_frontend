import Reveal from '../ui/Reveal';

const pains = [
  { icon: 'fa-comments', title: 'Buried in chats', text: 'Who agreed to what, and when it is due, scrolls away inside a thread.' },
  { icon: 'fa-table-cells', title: 'Scattered across spreadsheets', text: 'One sheet per client, and none of them quite up to date.' },
  { icon: 'fa-brain', title: 'Kept in your head', text: 'You remember that someone owes you. You just do not remember how much.' }
];

export default function Problem() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <Reveal>
          <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight">
            Where freelance money goes missing
          </h2>
          <p className="mt-3 max-w-sm text-muted">
            Late payments are rarely about bad clients. They happen because nobody wrote the amount down in one place.
          </p>
        </Reveal>
        <div className="border-t-2 border-strong">
          {pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 100} className="grid grid-cols-[32px_1fr] gap-3 border-b border-rule py-5">
              <i className={`fa-solid ${p.icon} pt-1 text-xl text-margin`} />
              <div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
