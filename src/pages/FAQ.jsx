import { useState } from 'react';
import Accordion from '../components/ui/Accordion';
import LinkButton from '../components/ui/LinkButton';
import { faqs } from '../data/faqs';

export default function FAQ() {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const shown = term ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(term)) : faqs;

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[320px_1fr] md:gap-16 md:py-20">
      <div className="md:sticky md:top-24 md:self-start">
        <h1 className="font-display text-5xl font-extrabold tracking-tight">Questions</h1>
        <p className="mt-3 text-muted">Short answers about how Khata works.</p>

        <label className="mt-6 flex items-center gap-2.5 border-b-2 border-strong py-2 focus-within:border-gold">
          <i className="fa-solid fa-magnifying-glass text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions"
            aria-label="Search questions"
            className="w-full bg-transparent outline-none"
          />
        </label>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {shown.length} of {faqs.length} questions
        </p>

        <div className="mt-8 rounded-md bg-paper p-5">
          <p className="font-semibold">Still stuck?</p>
          <p className="mb-3 text-sm text-muted">Send us a message and we will reply by email.</p>
          <LinkButton to="/contact" variant="ghost" icon="fa-envelope">Contact us</LinkButton>
        </div>
      </div>

      <div>
        {shown.length ? (
          <Accordion key={term} items={shown} />
        ) : (
          <p className="border-t-2 border-strong py-8 text-muted">No questions match "{q.trim()}". Try a shorter word.</p>
        )}
      </div>
    </section>
  );
}
