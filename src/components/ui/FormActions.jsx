import Button from './Button';

export default function FormActions({ onCancel, label }) {
  return (
    <div className="flex justify-end gap-2.5 pt-1">
      <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button>{label}</Button>
    </div>
  );
}
