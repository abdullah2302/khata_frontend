import { useState } from 'react';
import { useMonthlyEarnings, useTopClients, useProjectsByStatus } from '../hooks/useStats';
import { money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import { IconButton } from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import Alert from '../components/ui/Alert';
import EarningsChart, { MONTHS } from '../components/dashboard/EarningsChart';
import TopClients from '../components/reports/TopClients';
import ProjectStatusBars from '../components/reports/ProjectStatusBars';
import BudgetUsage from '../components/reports/BudgetUsage';

const fmt = (n) => money(Math.round(n));

export default function Reports() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const earnings = useMonthlyEarnings(year);
  const top = useTopClients();
  const statuses = useProjectsByStatus();

  const months = earnings.data?.data ?? [];
  const total = months.reduce((sum, m) => sum + m.total, 0);
  const best = months.reduce((b, m) => (m.total > (b?.total ?? 0) ? m : b), null);
  const failed = earnings.isError || top.isError || statuses.isError;

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
      {failed && <Alert>Could not load reports. Check that the server is running.</Alert>}

      <div className="mb-9 grid gap-6 border-t-2 border-strong pt-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="font-display text-3xl font-extrabold tracking-tight">{s.node}</p>
          </div>
        ))}
      </div>

      <EarningsChart data={months} year={year} />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TopClients items={top.data ?? []} />
        <ProjectStatusBars items={statuses.data ?? []} />
      </div>

      <div className="mt-10">
        <BudgetUsage />
      </div>
    </>
  );
}