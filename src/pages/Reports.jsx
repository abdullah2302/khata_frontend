import { useEffect, useState } from 'react';
import { getMonthlyEarnings, getTopClients, getProjectsByStatus } from '../api/statsApi';
import { money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import { IconButton } from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import Alert from '../components/ui/Alert';
import EarningsChart, { MONTHS } from '../components/dashboard/EarningsChart';
import TopClients from '../components/reports/TopClients';
import ProjectStatusBars from '../components/reports/ProjectStatusBars';

const fmt = (n) => money(Math.round(n));

export default function Reports() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [earnings, setEarnings] = useState([]);
  const [top, setTop] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getTopClients(), getProjectsByStatus()])
      .then(([t, s]) => { setTop(t); setStatuses(s); })
      .catch(() => setError('Could not load reports. Check that the server is running.'));
  }, []);

  useEffect(() => {
    getMonthlyEarnings(year)
      .then((d) => setEarnings(d.data))
      .catch(() => setError('Could not load reports. Check that the server is running.'));
  }, [year]);

  const total = earnings.reduce((sum, m) => sum + m.total, 0);
  const best = earnings.reduce((b, m) => (m.total > (b?.total ?? 0) ? m : b), null);

  const stats = [
    { label: `Earned in ${year}`, node: <CountUp value={total} format={fmt} /> },
    { label: 'Best month', node: best ? `${MONTHS[best.month - 1]}, ${money(best.total)}` : '-' },
    { label: 'Average per month', node: <CountUp value={total / 12} format={fmt} /> }
  ];

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Where your income comes from."
        action={
          <div className="flex items-center gap-1">
            <IconButton icon="fa-chevron-left" title="Previous year" onClick={() => setYear(year - 1)} />
            <span className="min-w-12 text-center font-semibold">{year}</span>
            <IconButton icon="fa-chevron-right" title="Next year" disabled={year >= thisYear} onClick={() => setYear(year + 1)} />
          </div>
        }
      />
      {error && <Alert>{error}</Alert>}

      <div className="mb-9 grid gap-6 border-t-2 border-ink pt-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="font-display text-3xl font-extrabold tracking-tight">{s.node}</p>
          </div>
        ))}
      </div>

      <EarningsChart data={earnings} year={year} />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TopClients items={top} />
        <ProjectStatusBars items={statuses} />
      </div>
    </>
  );
}
