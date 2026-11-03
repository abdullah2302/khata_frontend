import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients, createClient, updateClient, deleteClient } from '../api/clientApi';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import { errorMessage, orDash } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import Button, { IconButton, IconLink } from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import ExportButton from '../components/ui/ExportButton';
import DataTable from '../components/ui/DataTable';
import TableSkeleton from '../components/ui/TableSkeleton';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/forms/ClientForm';

export default function Clients() {
  const list = useList(getClients);
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, client = edit
  const [formError, setFormError] = useState('');

  const open = (client = {}) => { setFormError(''); setEditing(client); };

  const save = async (values) => {
    try {
      if (editing._id) await updateClient(editing._id, values);
      else await createClient(values);
      toast.success(editing._id ? 'Client updated' : 'Client added');
      setEditing(null);
      list.reload();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const remove = async (client) => {
    if (!window.confirm(`Delete ${client.name}?`)) return;
    try { await deleteClient(client._id); toast.success('Client deleted'); list.reload(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  const columns = [
    {
      label: 'Name',
      sortKey: 'name',
      render: (c) => <Link to={`/clients/${c._id}`} className="font-semibold hover:underline">{c.name}</Link>
    },
    { label: 'Company', sortKey: 'company', render: (c) => orDash(c.company) },
    { label: 'Email', render: (c) => orDash(c.email) },
    { label: 'Phone', render: (c) => orDash(c.phone) }
  ];

  const empty = !list.loading && list.items.length === 0 && !list.error;

  return (
    <>
      <PageHeader
        title="Clients"
        action={
          <div className="flex flex-wrap gap-2.5">
            <ExportButton
              fetcher={getClients}
              params={list.params}
              filename="clients.csv"
              map={(c) => ({ Name: c.name, Company: c.company, Email: c.email, Phone: c.phone, Notes: c.notes })}
            />
            <Button icon="fa-plus" onClick={() => open()}>New client</Button>
          </div>
        }
      />
      <div className="mb-3 flex flex-wrap items-end gap-2.5">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search clients" />
      </div>

      {list.error && <Alert>{list.error}</Alert>}

      {list.loading && list.items.length === 0 ? (
        <TableSkeleton />
      ) : empty ? (
        <EmptyState text="No clients found. Add your first client to get started." actionLabel="New client" onAction={() => open()} />
      ) : (
        <DataTable
          columns={columns}
          rows={list.items}
          sort={list.sort}
          onSort={list.toggleSort}
          actions={(c) => (
            <>
              <IconLink to={`/clients/${c._id}`} icon="fa-eye" title="View" />
              <IconButton icon="fa-pen" title="Edit" onClick={() => open(c)} />
              <IconButton icon="fa-trash" title="Delete" danger onClick={() => remove(c)} />
            </>
          )}
        />
      )}

      <Pagination page={list.page} pages={list.pages} total={list.total} onChange={list.setPage} />

      {editing && (
        <Modal title={editing._id ? 'Edit client' : 'New client'} onClose={() => setEditing(null)}>
          <ClientForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} error={formError} />
        </Modal>
      )}
    </>
  );
}
