import {
  useSummary, useMonthlyEarnings, useBilledVsPaid, usePendingByClient,
  useUpcoming, useTopClients, useProjectsByStatus, useBudgetUsage
} from '../hooks/useStats';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import SummaryLines from '../components/dashboard/SummaryLines';
import BilledVsPaid from '../components/dashboard/BilledVsPaid';
import StatusDonut from '../components/dashboard/StatusDonut';
import TrendChart from '../components/dashboard/TrendChart';
import OwingList from '../components/dashboard/OwingList';
import DueSoon from '../components/dashboard/DueSoon';
import TopClients from '../components/reports/TopClients';
import ProjectStatusBars from '../components/reports/ProjectStatusBars';

export default function Dashboard() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  const summary = useSummary();
  const earnings = useMonthlyEarnings(year);
  const billed = useBilledVsPaid(year);
  const owing = usePendingByClient();
  const upcoming = useUpcoming();
  const top = useTopClients();
  const projects = useProjectsByStatus();
  const budget = useBudgetUsage();

  const failed = [summary, earnings, billed, owing, upcoming, top, projects, budget].some((q) => q.isError);

  return (
    <>
      <PageHeader title={`Salam, ${user.name.split(' ')[0]}`} subtitle="Here is where your money stands." />
      {failed && <Alert>Could not load your ledger. Check that the server is running.</Alert>}

      <SummaryLines summary={summary.data ?? []} toInvoice={budget.data?.toInvoice ?? 0} />

      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <BilledVsPaid data={billed.data?.data ?? []} year={year} />
        <StatusDonut summary={summary.data ?? []} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TrendChart data={earnings.data?.data ?? []} year={year} />
        <OwingList items={owing.data ?? []} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TopClients items={top.data ?? []} />
        <ProjectStatusBars items={projects.data ?? []} />
      </div>

      <DueSoon items={upcoming.data ?? []} />
    </>
  );
}