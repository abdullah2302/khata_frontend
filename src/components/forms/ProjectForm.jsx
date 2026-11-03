import { useEffect, useState } from 'react';
import { getClients } from '../../api/clientApi';
import { Input, Select, Textarea } from '../ui/Fields';
import FormActions from '../ui/FormActions';
import Alert from '../ui/Alert';

export const PROJECT_STATUSES = ['lead', 'in-progress', 'completed', 'cancelled'];

export default function ProjectForm({ initial = {}, onSubmit, onCancel, error }) {
  const [clients, setClients] = useState([]);
  const [v, setV] = useState({
    title: initial.title || '',
    client: initial.client?._id || '',
    status: initial.status || 'lead',
    budget: initial.budget ?? '',
    deadline: initial.deadline ? initial.deadline.slice(0, 10) : '',
    description: initial.description || ''
  });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  useEffect(() => { getClients({ limit: 100 }).then((d) => setClients(d.items)); }, []);

  const submit = (e) => {
    e.preventDefault();
    const payload = { title: v.title, client: v.client, status: v.status, description: v.description };
    if (v.budget !== '') payload.budget = Number(v.budget);
    if (v.deadline) payload.deadline = v.deadline;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <Input label="Project title" value={v.title} onChange={set('title')} required />
      <Select label="Client" value={v.client} onChange={set('client')} required>
        <option value="">Choose a client</option>
        {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </Select>
      <Select label="Status" value={v.status} onChange={set('status')}>
        {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Budget" type="number" min="0" step="any" value={v.budget} onChange={set('budget')} />
        <Input label="Deadline" type="date" value={v.deadline} onChange={set('deadline')} />
      </div>
      <Textarea label="Description" value={v.description} onChange={set('description')} />
      {error && <Alert>{error}</Alert>}
      <FormActions onCancel={onCancel} label="Save project" />
    </form>
  );
}
