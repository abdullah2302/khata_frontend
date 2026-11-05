import { useState } from 'react';
import { getInvoices, createInvoice, updateInvoice, markInvoicePaid, deleteInvoice } from '../api/invoiceApi';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { reminderMessage } from '../utils/reminder';
import { errorMessage, fmtDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import Button, { IconButton, IconLink } from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import StatusFilter from '../components/ui/StatusFilter';
import StatusBadge from '../components/ui/StatusBadge';
import ExportButton from '../components/ui/ExportButton';
import DataTable from '../components/ui/DataTable';
import TableSkeleton from '../components/ui/TableSkeleton';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import InvoiceForm, { INVOICE_STATUSES } from '../components/forms/InvoiceForm';

export default function Invoices() {
  const list = useList('invoices', getInvoices)
  const toast = useToast();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');

  const open = (invoice = {}) => { setFormError(''); setEditing(invoice); };

  const save = async (values) => {
    try {
      if (editing._id) {
        await updateInvoice(editing._id, values);
        toast.success('Invoice updated');
      } else {
        const created = await createInvoice(values);
        toast.success(`${created.invoiceNumber} created`);
      }
      setEditing(null);
      list.reload();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const markPaid = async (invoice) => {
    try { await markInvoicePaid(invoice._id); toast.success(`${invoice.invoiceNumber} marked as paid`); list.reload(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  const copyReminder = async (invoice) => {
    try { await navigator.clipboard.writeText(reminderMessage(invoice, user.name)); toast.success('Reminder copied'); }
    catch { toast.error('Could not copy the reminder.'); }
  };

  

  const remove = async (invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.invoiceNumber}?`)) return;
    try { await deleteInvoice(invoice._id); toast.success('Invoice deleted'); list.reload(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  const columns = [
    { label: 'Invoice', sortKey: 'invoiceNumber', render: (i) => <span className="font-semibold">{i.invoiceNumber}</span> },
    { label: 'Client', render: (i) => i.client?.name || '-' },
    { label: 'Project', render: (i) => i.project?.title || '-' },
    {
      label: 'Amount',
      sortKey: 'amount',
      render: (i) => (
        <>
          {money(i.amount)}
          {i.percent ? <small className="block text-xs text-muted">{i.percent}% of the project</small> : null}
           {i.status === 'paid' && i.projectBalance != null && (
            <small className="block text-xs text-muted">
              {i.projectBalance > 0 ? `${money(i.projectBalance)} still to pay on the project` : 'Project fully paid'}
            </small>
          )}
        </>
      )
    },
    { label: 'Status', sortKey: 'status', render: (i) => <StatusBadge status={i.status} /> },
    { label: 'Due', sortKey: 'dueDate', render: (i) => fmtDate(i.dueDate) }
  ];

  const empty = !list.loading && list.items.length === 0 && !list.error;

  return (
    <>
      <PageHeader
        title="Invoices"
        action={
          <div className="flex flex-wrap gap-2.5">
            <ExportButton
              fetcher={getInvoices}
              params={list.params}
              filename="invoices.csv"
              map={(i) => ({
                Invoice: i.invoiceNumber,
                Client: i.client?.name,
                Project: i.project?.title,
                Amount: i.amount,
                Status: i.status,
                'Due date': i.dueDate ? i.dueDate.slice(0, 10) : '',
                'Paid on': i.paidAt ? i.paidAt.slice(0, 10) : ''
              })}
            />
            <Button icon="fa-plus" onClick={() => open()}>New invoice</Button>
          </div>
        }
      />
      <div className="mb-3 flex flex-wrap items-end gap-2.5">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search by invoice number" />
        <StatusFilter value={list.status} onChange={list.setStatus} options={INVOICE_STATUSES} />
      </div>

      {list.error && <Alert>{list.error}</Alert>}

      {list.loading && list.items.length === 0 ? (
        <TableSkeleton />
      ) : empty ? (
        <EmptyState text="No invoices found. Create your first invoice to track payments." actionLabel="New invoice" onAction={() => open()} />
      ) : (
        <DataTable
          columns={columns}
          rows={list.items}
          sort={list.sort}
          onSort={list.toggleSort}
          actions={(i) => (
            <>
              <IconLink to={`/invoices/${i._id}`} icon="fa-eye" title="View invoice" />
              {i.status !== 'paid' && (
                <>
                  <IconButton icon="fa-bell" title="Copy payment reminder" onClick={() => copyReminder(i)} />
                  <IconButton icon="fa-circle-check" title="Mark as paid" onClick={() => markPaid(i)} />
                </>
              )}
              <IconButton icon="fa-pen" title="Edit" onClick={() => open(i)} />
            
              <IconButton icon="fa-trash" title="Delete" danger onClick={() => remove(i)} />
            </>
          )}
        />
      )}

      <Pagination page={list.page} pages={list.pages} total={list.total} onChange={list.setPage} />

      {editing && (
        <Modal title={editing._id ? 'Edit invoice' : 'New invoice'} onClose={() => setEditing(null)}>
          <InvoiceForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} error={formError} />
        </Modal>
      )}
    </>
  );
}
