import Reveal from '../ui/Reveal';

const items = [
  { icon: 'fa-users', title: 'Clients', text: 'Names, companies, contact details and notes for everyone you work with, with a page for each client.' },
  { icon: 'fa-diagram-project', title: 'Projects', text: 'Status from lead to completed, with a budget and a deadline on every project.' },
  { icon: 'fa-file-invoice-dollar', title: 'Invoices', text: 'Record amounts and due dates, then mark an invoice paid with one click.' },
  { icon: 'fa-bell', title: 'Overdue flags', text: 'An unpaid invoice past its due date is flagged for you. No manual checking.' },
  { icon: 'fa-print', title: 'Printable invoices', text: 'Open any invoice and print it or save it as a PDF to send to your client.' },
  { icon: 'fa-chart-column', title: 'Reports and export', text: 'Earnings by month, your best clients, and a CSV export of everything.' }
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">What Khata keeps track of</h2>
          <p className="mt-2 max-w-xl text-muted">Everything a freelancer chases, in one ledger.</p>
        </Reveal>
        <div className="mt-8 grid border-t-2 border-strong md:grid-cols-2 md:gap-x-12">
          {items.map((i, n) => (
            <Reveal key={i.title} delay={(n % 2) * 90} className="grid grid-cols-[32px_1fr] gap-3 border-b border-rule py-5">
              <i className={`fa-solid ${i.icon} pt-1 text-xl text-strong`} />
              <div>
                <h3 className="font-display text-lg font-semibold">{i.title}</h3>
                <p className="text-muted">{i.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
