import { Fragment } from 'react';

// columns: [{ label, render: (row) => node, sortKey? }]   actions: (row) => node
// Pass `sort` and `onSort` to make columns with a sortKey clickable.
// On phones every row becomes a card (first column is the title).
export default function DataTable({ columns, rows, actions, sort, onSort }) {
  const arrow = (key) => (sort === key ? 'fa-sort-up' : sort === `-${key}` ? 'fa-sort-down' : 'fa-sort opacity-40');
  const ariaSort = (key) => (sort === key ? 'ascending' : sort === `-${key}` ? 'descending' : 'none');
  const delay = (i) => ({ animationDelay: `${Math.min(i, 10) * 35}ms` });

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.label}
                  aria-sort={c.sortKey && onSort ? ariaSort(c.sortKey) : undefined}
                  className="border-b-2 border-strong py-2 pr-3 text-left text-sm font-semibold text-muted"
                >
                  {c.sortKey && onSort ? (
                    <button onClick={() => onSort(c.sortKey)} className="inline-flex cursor-pointer items-center gap-1.5 hover:text-strong">
                      {c.label}
                      <i className={`fa-solid ${arrow(c.sortKey)} text-xs`} />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              <th className="border-b-2 border-strong" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r._id} className="animate-rise transition-colors hover:bg-card/60" style={delay(i)}>
                {columns.map((c) => (
                  <td key={c.label} className="border-b border-rule py-3.5 pr-3 align-top">{c.render(r)}</td>
                ))}
                <td className="border-b border-rule py-3.5 text-right whitespace-nowrap">{actions(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((r, i) => (
          <div key={r._id} className="animate-rise rounded-md border border-rule bg-card/60 p-4" style={delay(i)}>
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div className="min-w-0 break-words">{columns[0].render(r)}</div>
              <div className="shrink-0 whitespace-nowrap">{actions(r)}</div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 text-sm">
              {columns.slice(1).map((c) => (
                <Fragment key={c.label}>
                  <dt className="text-muted">{c.label}</dt>
                  <dd className="min-w-0 break-words">{c.render(r)}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
