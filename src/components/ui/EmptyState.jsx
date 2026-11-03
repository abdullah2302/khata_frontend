import Button from './Button';

export default function EmptyState({ text, actionLabel, onAction }) {
  return (
    <div className="py-8">
      <p className="mb-3 text-muted">{text}</p>
      {onAction && <Button variant="ghost" icon="fa-plus" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
