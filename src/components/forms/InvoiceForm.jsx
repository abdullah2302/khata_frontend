import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllProjects } from '../../hooks/queries';
import { money, round2 } from '../../utils/format';
import { Input, Select } from '../ui/Fields';
import FormActions from '../ui/FormActions';
import Alert from '../ui/Alert';

export const INVOICE_STATUSES = ['pending', 'paid', 'overdue']; // used by the list filter
const FORM_STATUSES = ['pending', 'paid']; // overdue is worked out from the due date
const PERCENTS = [25, 50, 75];

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-3">
    <span className="text-muted">{label}</span>
    <b className="text-right">{value}</b>
  </div>
);

const Chip = ({ active, ...props }) => (
  <button
    type="button"
    aria-pressed={active}
    {...props}
    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active ? 'border-ink bg-ink text-white' : 'border-strong/25 bg-card hover:bg-desk'
    }`}
  />
);

// New invoice: choose the project, then which share of its price to bill. The amount is worked out for you.
// Editing: only the due date and status can change.
export default function InvoiceForm({ initial = {}, onSubmit, onCancel, error }) {
  const editing = Boolean(initial._id);
  const { data: projects = [], isPending } = useAllProjects();
  const [v, setV] = useState({
    project: initial.project?._id || '',
    kind: null, // '25' | '50' | '75' | 'rest' | 'custom' (null = pick a sensible default)
    custom: '',
    status: initial.status === 'paid' ? 'paid' : 'pending',
    dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : ''
  });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const choices = projects.filter((p) => p.status !== 'cancelled');
  const selected = projects.find((p) => p._id === v.project);
  const f = selected?.finance;
  const noPrice = Boolean(selected) && !(f.budget > 0);
  const remaining = f?.remaining ?? 0;

  // First invoice defaults to an advance of 50%, later ones to whatever is left
  const kind = v.kind ?? (f?.invoiced > 0 ? 'rest' : '50');
  const share = kind === 'rest' ? 'rest' : kind === 'custom' ? Number(v.custom) : Number(kind);
  const ready = Boolean(selected) && !noPrice;
  const amount = !ready ? 0 : share === 'rest' ? remaining : round2((f.budget * share) / 100);
  const tooMuch = ready && round2(amount - remaining) > 0.01;
  const shown = ready && round2(remaining - amount) <= 0.01 ? remaining : amount; // last share takes leftover cents
  const percent = ready && f.budget > 0 ? round2((shown / f.budget) * 100) : 0;
  const blocked = !editing && (!ready || !(remaining > 0) || !(shown > 0) || tooMuch);

  const choose = (k) => () => setV({ ...v, kind: k });
  const fits = (p) => round2((f.budget * p) / 100 - remaining) <= 0.01;

  const submit = (e) => {
    e.preventDefault();
    onSubmit(editing ? { dueDate: v.dueDate, status: v.status } : { project: v.project, share, dueDate: v.dueDate, status: v.status });
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      {editing ? (
        <>
          <Input label="Invoice number" value={initial.invoiceNumber} disabled readOnly />
          <Input label="Client" value={initial.client?.name || '-'} disabled readOnly />
          <Input label="Project" value={initial.project?.title || 'No project'} disabled readOnly />
          <Input label="Amount" value={`${money(initial.amount)}${initial.percent ? ` (${initial.percent}% of the project price)` : ''}`} disabled readOnly />
        </>
      ) : (
        <>
          <p className="rounded-md bg-desk px-3 py-2 text-sm text-muted">
            <i className="fa-solid fa-hashtag mr-2" />
            The invoice number (like INV-0001) is created automatically when you save.
          </p>

          {!isPending && choices.length === 0 ? (
            <Alert>
              You have no projects yet. <Link to="/projects" className="font-semibold underline">Create a project</Link> with
              its price first, then come back to invoice it.
            </Alert>
          ) : (
            <Select label="Which project is this invoice for?" value={v.project} onChange={(e) => setV({ ...v, project: e.target.value, kind: null })} required>
              <option value="">Choose a project</option>
              {choices.map((p) => {
                const done = p.finance.budget > 0 && p.finance.remaining <= 0;
                return (
                  <option key={p._id} value={p._id} disabled={done}>
                    {p.title} ({p.client?.name}){done ? ' - fully invoiced' : ''}
                  </option>
                );
              })}
            </Select>
          )}

          {noPrice && <Alert>This project has no price yet. Open the project, add its price, and then create the invoice.</Alert>}

          {ready && (
            <>
              <div className="grid gap-1 rounded-md bg-desk px-3.5 py-3 text-sm">
                <Row label="Client" value={selected.client?.name} />
                <Row label="Project price" value={money(f.budget)} />
                <Row label="Already invoiced" value={money(f.invoiced)} />
                <Row label="Still left to invoice" value={money(remaining)} />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">How much of the price is this invoice for?</p>
                <div className="flex flex-wrap gap-2">
                  {PERCENTS.map((p) => (
                    <Chip key={p} active={kind === String(p)} disabled={!fits(p)} onClick={choose(String(p))}>
                      {p}%
                    </Chip>
                  ))}
                  <Chip active={kind === 'rest'} onClick={choose('rest')}>
                    {f.invoiced > 0 ? 'Final' : 'All'}: {money(remaining)}
                  </Chip>
                  <Chip active={kind === 'custom'} onClick={choose('custom')}>Custom %</Chip>
                </div>
                {kind === 'custom' && (
                  <div className="mt-2.5 max-w-40">
                    <Input label="Percent of the price" type="number" min="0.01" max="100" step="any" value={v.custom} onChange={set('custom')} autoFocus required />
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3 rounded-md border border-rule px-3.5 py-3">
                <span className="text-muted">This invoice{percent > 0 ? ` (${percent}%)` : ''}</span>
                <b className="font-display text-2xl">{money(shown)}</b>
              </div>
              {tooMuch && <Alert>That is more than what is left of the project price ({money(remaining)}). Pick a smaller share.</Alert>}
            </>
          )}
        </>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Due date" type="date" value={v.dueDate} onChange={set('dueDate')} required />
        <Select label="Status" value={v.status} onChange={set('status')}>
          {FORM_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </Select>
      </div>

      {error && <Alert>{error}</Alert>}
      <FormActions onCancel={onCancel} label="Save invoice" disabled={blocked} />
    </form>
  );
}