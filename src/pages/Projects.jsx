import { useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projectApi';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import { errorMessage, fmtDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import Button, { IconButton } from '../components/ui/Button';
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
import ProjectForm, { PROJECT_STATUSES } from '../components/forms/ProjectForm';

export default function Projects() {
  const list = useList(getProjects);
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');

  const open = (project = {}) => { setFormError(''); setEditing(project); };

  const save = async (values) => {
    try {
      if (editing._id) await updateProject(editing._id, values);
      else await createProject(values);
      toast.success(editing._id ? 'Project updated' : 'Project added');
      setEditing(null);
      list.reload();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const remove = async (project) => {
    if (!window.confirm(`Delete ${project.title}?`)) return;
    try { await deleteProject(project._id); toast.success('Project deleted'); list.reload(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  const columns = [
    { label: 'Project', sortKey: 'title', render: (p) => <span className="font-semibold">{p.title}</span> },
    { label: 'Client', render: (p) => p.client?.name || '-' },
    { label: 'Status', sortKey: 'status', render: (p) => <StatusBadge status={p.status} /> },
    { label: 'Budget', sortKey: 'budget', render: (p) => money(p.budget) },
    { label: 'Deadline', sortKey: 'deadline', render: (p) => fmtDate(p.deadline) }
  ];

  const empty = !list.loading && list.items.length === 0 && !list.error;

  return (
    <>
      <PageHeader
        title="Projects"
        action={
          <div className="flex flex-wrap gap-2.5">
            <ExportButton
              fetcher={getProjects}
              params={list.params}
              filename="projects.csv"
              map={(p) => ({
                Project: p.title,
                Client: p.client?.name,
                Status: p.status,
                Budget: p.budget,
                Deadline: p.deadline ? p.deadline.slice(0, 10) : ''
              })}
            />
            <Button icon="fa-plus" onClick={() => open()}>New project</Button>
          </div>
        }
      />
      <div className="mb-3 flex flex-wrap items-end gap-2.5">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search projects" />
        <StatusFilter value={list.status} onChange={list.setStatus} options={PROJECT_STATUSES} />
      </div>

      {list.error && <Alert>{list.error}</Alert>}

      {list.loading && list.items.length === 0 ? (
        <TableSkeleton />
      ) : empty ? (
        <EmptyState text="No projects found. Add a client first, then create a project." actionLabel="New project" onAction={() => open()} />
      ) : (
        <DataTable
          columns={columns}
          rows={list.items}
          sort={list.sort}
          onSort={list.toggleSort}
          actions={(p) => (
            <>
              <IconButton icon="fa-pen" title="Edit" onClick={() => open(p)} />
              <IconButton icon="fa-trash" title="Delete" danger onClick={() => remove(p)} />
            </>
          )}
        />
      )}

      <Pagination page={list.page} pages={list.pages} total={list.total} onChange={list.setPage} />

      {editing && (
        <Modal title={editing._id ? 'Edit project' : 'New project'} onClose={() => setEditing(null)}>
          <ProjectForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} error={formError} />
        </Modal>
      )}
    </>
  );
}
