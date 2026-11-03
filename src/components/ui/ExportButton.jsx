import { useState } from 'react';
import Button from './Button';
import { useToast } from '../../context/ToastContext';
import { fetchAll, downloadCsv } from '../../utils/exportCsv';

// Downloads every row matching the current filters as a CSV file.
export default function ExportButton({ fetcher, params, filename, map }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const items = await fetchAll(fetcher, params);
      if (!items.length) return toast.error('Nothing to export yet');
      downloadCsv(filename, items.map(map));
      toast.success(`Exported ${items.length} rows`);
    } catch {
      toast.error('Export failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="ghost" icon={busy ? 'fa-spinner fa-spin' : 'fa-file-csv'} onClick={run} disabled={busy}>
      Export CSV
    </Button>
  );
}
