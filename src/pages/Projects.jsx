import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projectApi';
import useList from '../hooks/useList';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../utils/format';
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
import BudgetBar from '../components/projects/BudgetBar';
import DeadlineBadge from '../components/projects/DeadlineBadge';
import ProjectBoard from '../components/projects/ProjectBoard';
import ProjectForm, { PROJECT_STATUSES } from '../components/forms/ProjectForm';

export default function Projects() {
  const list = useList('projects', getProjects)
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');
  const [view, setView] = useState(() => localStorage.getItem('projectView') || 'list');
  const [boardKey, setBoardKey] = useState(0); // changing it makes the board reload its data

  const changeView = (next) => { setView(next); localStorage.setItem('projectView', next); };
  const refresh = () => { list.reload(); setBoardKey((k) => k + 1); };
  const open = (project = {}) => { setFormError(''); setEditing(project); };

  const save = async (values) => {
    try {
      if (editing._id) await updateProject(editing._id, values);
      else await createProject(values);
      toast.success(editing._id ? 'Project updated' : 'Project added');
      setEditing(null);
      refresh();
    } catch (e) { setFormError(errorMessage(e)); }
  };

  const remove = async (project) => {
    if (!window.confirm(`Delete ${project.title}? Its invoices are kept.`)) return;
    try { await deleteProject(project._id); toast.success('Project deleted'); refresh(); }
    catch (e) { toast.error(errorMessage(e)); }
  };

  const columns = [
    {
      label: 'Project',
      sortKey: 'title',
      render: (p) => <Link to={`/projects/${p._id}`} className="font-semibold hover:underline">{p.title}</Link>
    },
    { label: 'Client', render: (p) => p.client?.name || '-' },
    { label: 'Status', sortKey: 'status', render: (p) => <StatusBadge status={p.status} /> },
    { label: 'Budget used', sortKey: 'budget', render: (p) => <BudgetBar finance={p.finance} compact /> },
    { label: 'Deadline', sortKey: 'deadline', render: (p) => <DeadlineBadge date={p.deadline} status={p.status} /> }
  ];

  const empty = !list.loading && list.items.length === 0 && !list.error;
  const toggle = (name, icon, text) => (
    <button
      onClick={() => changeView(name)}
      aria-pressed={view === name}
      className={`flex cursor-pointer items-center gap-2 px-3.5 py-2 text-sm font-semibold transition-colors ${view === name ? 'bg-ink text-white' : 'hover:bg-desk'}`}
    >
      <i className={`fa-solid ${icon}`} />
      {text}
    </button>
  );

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
                Invoiced: p.finance?.invoiced,
                Paid: p.finance?.paid,
                Deadline: p.deadline ? p.deadline.slice(0, 10) : ''
              })}
            />
            <Button icon="fa-plus" onClick={() => open()}>New project</Button>
          </div>
        }
      />

      <div className="mb-3 flex flex-wrap items-end gap-2.5">
        <SearchBar value={list.search} onChange={list.setSearch} placeholder="Search projects" />
        {view === 'list' && <StatusFilter value={list.status} onChange={list.setStatus} options={PROJECT_STATUSES} />}
        <div className="flex overflow-hidden rounded-md border border-rule bg-card" role="group" aria-label="View">
          {toggle('list', 'fa-list', 'List')}
          {toggle('board', 'fa-table-columns', 'Board')}
        </div>
      </div>

      {list.error && <Alert>{list.error}</Alert>}

      {view === 'board' ? (
        <ProjectBoard key={boardKey} search={list.search} />
      ) : (
        <>
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
                  <IconLink to={`/projects/${p._id}`} icon="fa-eye" title="View project" />
                  <IconButton icon="fa-pen" title="Edit" onClick={() => open(p)} />
                  <IconButton icon="fa-trash" title="Delete" danger onClick={() => remove(p)} />
                </>
              )}
            />
          )}
          <Pagination page={list.page} pages={list.pages} total={list.total} onChange={list.setPage} />
        </>
      )}

      {editing && (
        <Modal title={editing._id ? 'Edit project' : 'New project'} onClose={() => setEditing(null)}>
          <ProjectForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} error={formError} />
        </Modal>
      )}
    </>
  );
}
