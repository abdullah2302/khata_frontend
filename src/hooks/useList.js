import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

// Pagination, debounced search, status filter, column sorting, loading and errors for a list page.
// `fetcher` must be a stable function (the api functions are).
export default function useList(fetcher, limit = 8) {
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const query = useDebounce(search);

  // asc -> desc -> default
  const toggleSort = (key) => setSort((s) => (s === key ? `-${key}` : s === `-${key}` ? '' : key));

  useEffect(() => { setPage(1); }, [query, status, sort]);

  const params = { search: query || undefined, status: status || undefined, sort: sort || undefined };

  const reload = useCallback(() => {
    setLoading(true);
    return fetcher({ page, limit, search: query || undefined, status: status || undefined, sort: sort || undefined })
      .then((d) => { setData(d); setError(''); })
      .catch(() => setError('Could not load data. Check that the server is running.'))
      .finally(() => setLoading(false));
  }, [fetcher, page, limit, query, status, sort]);

  useEffect(() => { reload(); }, [reload]);

  return { ...data, page, setPage, search, setSearch, status, setStatus, sort, toggleSort, params, error, loading, reload };
}
