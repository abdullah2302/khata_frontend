import { IconButton } from './Button';

export default function Pagination({ page, pages, total, onChange }) {
  return (
    <div className="mt-3.5 flex items-center justify-end gap-3 text-muted">
      <span>{total} total</span>
      <IconButton icon="fa-chevron-left" title="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} />
      <span>Page {page} of {pages || 1}</span>
      <IconButton icon="fa-chevron-right" title="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} />
    </div>
  );
}
