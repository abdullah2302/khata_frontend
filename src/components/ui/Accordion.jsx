import { useState } from 'react';

// items: [{ q, a }]  One item open at a time, smooth height animation.
export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="border-t-2 border-strong">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-b border-rule">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-lg font-semibold"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              {it.q}
              <i className={`fa-solid fa-chevron-down text-sm text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              id={`faq-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden" aria-hidden={!isOpen}>
                <p className="max-w-prose pb-4 leading-relaxed text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
