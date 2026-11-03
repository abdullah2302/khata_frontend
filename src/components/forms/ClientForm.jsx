import { useState } from 'react';
import { Input, Textarea } from '../ui/Fields';
import FormActions from '../ui/FormActions';
import Alert from '../ui/Alert';

export default function ClientForm({ initial = {}, onSubmit, onCancel, error }) {
  const [v, setV] = useState({
    name: initial.name || '',
    company: initial.company || '',
    email: initial.email || '',
    phone: initial.phone || '',
    notes: initial.notes || ''
  });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); }} className="grid gap-3.5">
      <Input label="Name" value={v.name} onChange={set('name')} required />
      <Input label="Company" value={v.company} onChange={set('company')} />
      <Input label="Email" type="email" value={v.email} onChange={set('email')} />
      <Input label="Phone" value={v.phone} onChange={set('phone')} />
      <Textarea label="Notes" value={v.notes} onChange={set('notes')} />
      {error && <Alert>{error}</Alert>}
      <FormActions onCancel={onCancel} label="Save client" />
    </form>
  );
}
