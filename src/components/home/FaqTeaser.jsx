import Reveal from '../ui/Reveal';
import Accordion from '../ui/Accordion';
import LinkButton from '../ui/LinkButton';
import { faqs } from '../../data/faqs';

export default function FaqTeaser() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <Reveal>
          <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight">Quick answers</h2>
          <p className="mt-3 mb-5 max-w-sm text-muted">The questions people ask before they open a ledger.</p>
          <LinkButton to="/faq" variant="ghost" icon="fa-circle-question">See all questions</LinkButton>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={faqs.slice(0, 3)} />
        </Reveal>
      </div>
    </section>
  );
}
