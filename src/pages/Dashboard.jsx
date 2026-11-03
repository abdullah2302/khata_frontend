import { useEffect, useState } from 'react';
import {
  getSummary, getMonthlyEarnings, getPendingByClient, getUpcoming,
  getBilledVsPaid, getTopClients, getProjectsByStatus, getBudgetUsage
} from '../api/statsApi';
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
  const [d, setD] = useState({ summary: [], earnings: [], billed: [], owing: [], upcoming: [], top: [], projects: [], toInvoice: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getSummary(), getMonthlyEarnings(year), getBilledVsPaid(year), getPendingByClient(),
      getUpcoming(), getTopClients(), getProjectsByStatus(), getBudgetUsage()
    ])
      .then(([summary, earnings, billed, owing, upcoming, top, projects, budget]) =>
        setD({ summary, earnings: earnings.data, billed: billed.data, owing, upcoming, top, projects, toInvoice: budget.toInvoice })
      )
      .catch(() => setError('Could not load your ledger. Check that the server is running.'));
  }, [year]);

  return (
    <>
      <PageHeader title={`Salam, ${user.name.split(' ')[0]}`} subtitle="Here is where your money stands." />
      {error && <Alert>{error}</Alert>}

      <SummaryLines summary={d.summary} toInvoice={d.toInvoice} />

      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <BilledVsPaid data={d.billed} year={year} />
        <StatusDonut summary={d.summary} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TrendChart data={d.earnings} year={year} />
        <OwingList items={d.owing} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <TopClients items={d.top} />
        <ProjectStatusBars items={d.projects} />
      </div>

      <DueSoon items={d.upcoming} />
    </>
  );
}
