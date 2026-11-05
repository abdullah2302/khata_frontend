import { Link,  useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { markInvoicePaid } from '../api/invoiceApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { errorMessage, fmtDate, money,round2  } from '../utils/format';
import { reminderMessage, whatsappLink } from '../utils/reminder';
import Button from '../components/ui/Button';
import LinkButton from '../components/ui/LinkButton';
import StatusBadge from '../components/ui/StatusBadge';
import TableSkeleton from '../components/ui/TableSkeleton';
import Alert from '../components/ui/Alert';
import { useInvoice } from '../hooks/queries';

const label = 'text-sm text-muted';

export default function InvoiceView() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
 
  const queryClient = useQueryClient();

  const { data: inv, error } = useInvoice(id);
  const load = () => queryClient.invalidateQueries({ queryKey: ['invoice', id] });

  const markPaid = async () => {
    try { await markInvoicePaid(id); toast.success('Invoice marked as paid'); load(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  
  const back = (
    <Link to="/invoices" className="text-muted hover:text-strong">
      <i className="fa-solid fa-arrow-left mr-1.5" />
      Invoices
    </Link>
  );

  if (error) return <><div className="mb-4">{back}</div><Alert>{errorMessage(error)}</Alert></>;
  if (!inv) return <><div className="mb-4">{back}</div><TableSkeleton rows={4} /></>;

  const reminder = reminderMessage(inv, user.name);
  const copyReminder = async () => {
    try { await navigator.clipboard.writeText(reminder); toast.success('Reminder copied'); }
    catch { toast.error('Could not copy. Select the text and copy it manually.'); }
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        {back}
        <div className="flex flex-wrap gap-2.5">
          {inv.status !== 'paid' && (
            <>
              <Button variant="ghost" icon="fa-copy" onClick={copyReminder}>Copy reminder</Button>
              <LinkButton href={whatsappLink(reminder)} target="_blank" rel="noopener noreferrer" variant="ghost" icon="fa-brands fa-whatsapp">
                WhatsApp
              </LinkButton>
              <Button variant="ghost" icon="fa-circle-check" onClick={markPaid}>Mark as paid</Button>
            </>
          )}
         
          <Button icon="fa-print" onClick={() => window.print()}>Print or save as PDF</Button>
        </div>
      </div>

      <article>
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-strong pb-5">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">Invoice</h1>
            <p className="text-muted">{inv.invoiceNumber}</p>
          </div>
          {inv.status === 'paid' ? (
            <span className="-rotate-[8deg] animate-stamp rounded-md border-4 border-emerald-700 px-4 py-1 font-display text-3xl font-extrabold text-emerald-700">
              PAID
            </span>
          ) : (
            <StatusBadge status={inv.status} />
          )}
        </header>

        <div className="grid gap-6 border-b border-rule py-6 sm:grid-cols-2">
          <div>
            <p className={label}>From</p>
            <p className="font-semibold">{user.name}</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className={label}>Bill to</p>
            <p className="font-semibold">{inv.client?.name}</p>
            {inv.client?.company && <p>{inv.client.company}</p>}
            {inv.client?.email && <p>{inv.client.email}</p>}
            {inv.client?.phone && <p>{inv.client.phone}</p>}
          </div>
        </div>

        <div className="grid gap-4 border-b border-rule py-6 sm:grid-cols-3">
          <div><p className={label}>Issued</p><p>{fmtDate(inv.createdAt)}</p></div>
          <div><p className={label}>Due</p><p>{fmtDate(inv.dueDate)}</p></div>
          <div><p className={label}>Paid on</p><p>{inv.paidAt ? fmtDate(inv.paidAt) : '-'}</p></div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-rule py-4">
          <div>
            <p className="font-semibold">{inv.project?.title || 'Services'}</p>
            {inv.percent ? <p className="text-sm text-muted">{inv.percent}% of the project price</p> : null}
            {inv.project?.description && <p className="text-sm text-muted">{inv.project.description}</p>}
          </div>
          <span>{money(inv.amount)}</span>
        </div>

        <div className="flex items-baseline justify-between py-5">
          <span className="text-muted">Total</span>
          <b className="font-display text-4xl font-extrabold tracking-tight">{money(inv.amount)}</b>
        </div>
        <p className="text-sm text-muted">Thank you for your business.</p>
        
        {inv.projectFinance?.budget > 0 && (
          <div className="mb-5 grid gap-1.5 rounded-md border border-rule p-4 text-sm">
            <p className="mb-1 font-semibold">Project balance</p>
            <div className="flex justify-between gap-3"><span className="text-muted">Project price</span><b>{money(inv.projectFinance.budget)}</b></div>
            <div className="flex justify-between gap-3"><span className="text-muted">Paid so far</span><b>{money(inv.projectFinance.paid)}</b></div>
            {inv.status !== 'paid' && (
              <div className="flex justify-between gap-3"><span className="text-muted">This invoice (not paid yet)</span><b>{money(inv.amount)}</b></div>
            )}
            <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-rule pt-2.5">
              <span className="font-semibold">{inv.status === 'paid' ? 'Remaining to pay' : 'Remaining after this invoice is paid'}</span>
              <b className="font-display text-2xl">
                {money(inv.status === 'paid' ? inv.projectFinance.balance : round2(inv.projectFinance.balance - inv.amount))}
              </b>
            </div>
            {(inv.status === 'paid' ? inv.projectFinance.balance : round2(inv.projectFinance.balance - inv.amount)) <= 0 && (
              <p className="text-emerald-700">The project is fully paid.</p>
            )}
          </div>
        )}

        <p className="text-sm text-muted">Thank you for your business.</p>
        {inv.status !== 'paid' && (
          <div className="mt-8 rounded-md border border-rule bg-card/60 p-4 print:hidden">
            <p className="mb-1 text-sm font-semibold">Payment reminder</p>
            <p className="text-sm text-muted">{reminder}</p>
          </div>
        )}
      </article>
    </>
  );
}