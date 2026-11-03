import { useEffect, useState } from 'react';
import Sheet from '../ui/Sheet';
import Reveal from '../ui/Reveal';
import OnView from '../ui/OnView';
import BilledVsPaid from '../dashboard/BilledVsPaid';
import StatusDonut from '../dashboard/StatusDonut';

const year = new Date().getFullYear();
const sample = [
  [1200, 900], [1500, 1200], [900, 1500], [1800, 1100], [2200, 1700], [1400, 1900],
  [2600, 1800], [1700, 2300], [2100, 1600], [1900, 2000], [0, 0], [0, 0]
].map(([billed, paid], i) => ({ month: i + 1, billed, paid }));

const sampleSummary = [
  { _id: 'paid', total: 2400, count: 3 },
  { _id: 'pending', total: 1150, count: 2 },
  { _id: 'overdue', total: 300, count: 1 }
];

// The donut animates when its data changes, so feed it a moment after it appears.
function SampleDonut() {
  const [summary, setSummary] = useState([]);
  useEffect(() => {
    const t = setTimeout(() => setSummary(sampleSummary), 150);
    return () => clearTimeout(t);
  }, []);
  return <StatusDonut summary={summary} />;
}

export default function DashboardPreview() {
  return (
    <section className="bg-ink px-2.5 py-16 md:px-7">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-8 px-2.5 text-paper">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Your ledger at a glance</h2>
          <p className="mt-2 max-w-xl text-white/75">
            Invoiced against received, and where every invoice stands. The charts below use sample data.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Sheet className="max-w-5xl">
            <OnView className="grid min-h-72 gap-10 md:grid-cols-[2fr_1fr]">
              <BilledVsPaid data={sample} year={year} />
              <SampleDonut />
            </OnView>
          </Sheet>
        </Reveal>
      </div>
    </section>
  );
}
