// columns: [{ label, render: (row) => node, sortKey? }]   actions: (row) => node
// Pass `sort` and `onSort` to make columns with a sortKey clickable.
export default function DataTable({ columns, rows, actions, sort, onSort }) {
  const arrow = (key) => (sort === key ? 'fa-sort-up' : sort === `-${key}` ? 'fa-sort-down' : 'fa-sort opacity-40');
  const ariaSort = (key) => (sort === key ? 'ascending' : sort === `-${key}` ? 'descending' : 'none');

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.label}
                aria-sort={c.sortKey && onSort ? ariaSort(c.sortKey) : undefined}
                className="border-b-2 border-ink py-2 pr-3 text-left text-sm font-semibold text-muted"
              >
                {c.sortKey && onSort ? (
                  <button onClick={() => onSort(c.sortKey)} className="inline-flex cursor-pointer items-center gap-1.5 hover:text-ink">
                    {c.label}
                    <i className={`fa-solid ${arrow(c.sortKey)} text-xs`} />
                  </button>
                ) : (
                  c.label
                )}
              </th>
            ))}
            <th className="border-b-2 border-ink" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r._id}
              className="animate-rise transition-colors hover:bg-white/60"
              style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
            >
              {columns.map((c) => (
                <td key={c.label} className="border-b border-rule py-3.5 pr-3">{c.render(r)}</td>
              ))}
              <td className="border-b border-rule py-3.5 text-right whitespace-nowrap">{actions(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
