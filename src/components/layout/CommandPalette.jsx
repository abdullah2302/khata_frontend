import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../../api/clientApi';
import { getProjects } from '../../api/projectApi';
import { getInvoices } from '../../api/invoiceApi';
import useDebounce from '../../hooks/useDebounce';
import { money } from '../../utils/format';

const pages = [
  { icon: 'fa-book-open', label: 'Ledger', sub: 'Dashboard', to: '/dashboard' },
  { icon: 'fa-users', label: 'Clients', sub: 'Page', to: '/clients' },
  { icon: 'fa-diagram-project', label: 'Projects', sub: 'Page', to: '/projects' },
  { icon: 'fa-file-invoice-dollar', label: 'Invoices', sub: 'Page', to: '/invoices' },
  { icon: 'fa-chart-column', label: 'Reports', sub: 'Page', to: '/reports' },
  { icon: 'fa-gear', label: 'Settings', sub: 'Page', to: '/settings' }
];

// Ctrl+K quick search across clients, projects and invoices, with keyboard navigation.
export default function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [q, setQ] = useState('');
  const query = useDebounce(q.trim(), 250);
  const [found, setFound] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query) { setFound([]); return; }
    let cancelled = false;
    Promise.all([
      getClients({ search: query, limit: 4 }),
      getProjects({ search: query, limit: 4 }),
      getInvoices({ search: query, limit: 4 })
    ])
      .then(([c, p, i]) => {
        if (cancelled) return;
        setFound([
          ...c.items.map((x) => ({ icon: 'fa-users', label: x.name, sub: x.company || 'Client', to: `/clients/${x._id}` })),
          ...p.items.map((x) => ({ icon: 'fa-diagram-project', label: x.title, sub: `Project, ${x.client?.name || ''}`, to: '/projects' })),
          ...i.items.map((x) => ({ icon: 'fa-file-invoice-dollar', label: x.invoiceNumber, sub: `Invoice, ${money(x.amount)}`, to: `/invoices/${x._id}` }))
        ]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [query]);

  const items = q.trim() ? found : pages;
  useEffect(() => { setActive(0); }, [items]);

  const go = (item) => { onClose(); navigate(item.to); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && items[active]) go(items[active]);
    else if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-40 grid animate-fade place-items-start justify-items-center bg-ink/55 p-4 pt-[12vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="w-full max-w-xl animate-pop overflow-hidden rounded-md bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="flex items-center gap-3 border-b border-rule px-4 py-3.5">
          <i className="fa-solid fa-magnifying-glass text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search clients, projects and invoices"
            className="w-full bg-transparent text-lg outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
          />
        </label>

        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {items.map((item, i) => (
            <li key={`${item.to}-${item.label}-${i}`} role="option" aria-selected={i === active}>
              <button
                onClick={() => go(item)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left ${i === active ? 'bg-desk' : ''}`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center text-muted`} />
                <span className="flex-1 font-semibold">{item.label}</span>
                <span className="text-sm text-muted">{item.sub}</span>
              </button>
            </li>
          ))}
          {q.trim() && items.length === 0 && <li className="px-3 py-6 text-center text-muted">No matches for "{q.trim()}".</li>}
        </ul>

        <p className="border-t border-rule px-4 py-2 text-xs text-muted">Up and down to move, Enter to open, Esc to close.</p>
      </div>
    </div>
  );
}
