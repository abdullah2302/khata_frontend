// A dictionary entry for the word "khata", the idea behind the app.
export default function WordEntry() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-14 md:pt-20">
      <div className="flex animate-rise flex-wrap items-baseline gap-x-6 gap-y-1">
        <h1 className="font-display text-7xl font-extrabold tracking-tight md:text-9xl">khata</h1>
        <span lang="ur" dir="rtl" className="font-urdu text-5xl text-margin md:text-6xl">کھاتہ</span>
      </div>
      <p className="mt-2 animate-rise text-lg text-muted italic" style={{ animationDelay: '100ms' }}>
        noun, from Urdu and Hindi
      </p>
      <ol
        className="mt-6 max-w-3xl animate-rise list-decimal space-y-3 border-t-[6px] border-double border-gold pt-6 pl-6 text-xl leading-relaxed md:text-2xl"
        style={{ animationDelay: '200ms' }}
      >
        <li>A ledger book in which a shopkeeper writes down who has paid and who still owes.</li>
        <li>The same book, rebuilt for freelancers. This app.</li>
      </ol>
    </section>
  );
}
