import Reveal from '../components/ui/Reveal';
import WordEntry from '../components/about/WordEntry';
import Replaces from '../components/about/Replaces';
import Principles from '../components/about/Principles';
import StackGrid from '../components/about/StackGrid';
import Colophon from '../components/about/Colophon';
import CallToAction from '../components/home/CallToAction';

const h2 = 'font-display text-3xl leading-tight font-extrabold tracking-tight';

export default function About() {
  return (
    <>
      <WordEntry />

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <Reveal>
            <h2 className={h2}>Why it exists</h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              Freelancers keep the same kind of account a shopkeeper does, but it ends up scattered across chats,
              spreadsheets and memory. Khata puts it in one place, so the answer to who still owes you money is always
              one click away.
            </p>
          </Reveal>
          <Replaces />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 className={h2}>What Khata holds to</h2>
            <p className="mt-3 max-w-xl text-muted">
              Made for developers, designers, writers, tutors and small teams who bill clients project by project.
            </p>
          </Reveal>
          <Principles />
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <Reveal>
            <h2 className={h2}>Built with</h2>
            <p className="mt-3 max-w-sm text-muted">A classic MERN stack, kept simple on purpose.</p>
          </Reveal>
          <StackGrid />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 className={`${h2} mb-8`}>Colophon</h2>
          </Reveal>
          <Colophon />
        </div>
      </section>

      <CallToAction />
    </>
  );
}
