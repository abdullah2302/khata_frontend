import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import useDebounce from './useDebounce';

// Pagination, debounced search, status filter and column sorting for a list page, cached by TanStack Query.
//   key     = cache name, e.g. 'clients'
//   fetcher = api function that takes { page, limit, search, status, sort }
// While the next page loads, the previous one stays on screen (keepPreviousData).
export default function useList(key, fetcher, limit = 8) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');
  const query = useDebounce(search);

  // asc -> desc -> default
  const toggleSort = (k) => setSort((s) => (s === k ? `-${k}` : s === `-${k}` ? '' : k));

  useEffect(() => { setPage(1); }, [query, status, sort]);

  const params = { search: query || undefined, status: status || undefined, sort: sort || undefined };

  const { data, isPending, isError } = useQuery({
    queryKey: [key, { page, limit, ...params }],
    queryFn: () => fetcher({ page, limit, ...params }),
    placeholderData: keepPreviousData
  });

  // If the current page no longer exists (last row deleted), go back to the last page
  useEffect(() => {
    if (data && page > (data.pages || 1)) setPage(data.pages || 1);
  }, [data, page]);

  return {
    items: data?.items ?? [],
    pages: data?.pages ?? 1,
    total: data?.total ?? 0,
    page, setPage, search, setSearch, status, setStatus, sort, toggleSort, params,
    loading: isPending,
    error: isError ? 'Could not load data. Check that the server is running.' : '',
    // After a change, mark everything as stale so lists, charts and totals all refresh
    reload: () => queryClient.invalidateQueries()
  };
}