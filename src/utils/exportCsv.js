const escapeCell = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Loads every page of a paginated list (the API caps a page at 100 rows).
export async function fetchAll(fetcher, params = {}) {
  const all = [];
  let page = 1;
  let pages = 1;
  do {
    const data = await fetcher({ ...params, page, limit: 100 });
    all.push(...data.items);
    pages = data.pages;
    page += 1;
  } while (page <= pages);
  return all;
}

export function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
