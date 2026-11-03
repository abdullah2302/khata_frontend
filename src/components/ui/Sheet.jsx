// Ledger paper with a red margin line. Used by the app layout.
export default function Sheet({ children, className = '' }) {
  return (
    <div
      className={`relative mx-auto rounded-sm bg-paper py-10 pr-10 pl-[84px] shadow-[0_1px_0_var(--color-rule),0_12px_30px_-18px_color-mix(in_oklab,var(--color-ink)_45%,transparent)] before:absolute before:inset-y-0 before:left-14 before:w-0.5 before:bg-margin/70 before:content-[''] max-md:py-6 max-md:pr-4 max-md:pl-11 max-md:before:left-8 max-sm:pl-10 max-sm:before:left-7 print:max-w-none print:p-0 print:shadow-none print:before:hidden ${className}`}
    >
      {children}
    </div>
  );
}
