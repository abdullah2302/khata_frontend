import { getCurrency, money } from '../../utils/format';
import { MONTHS } from './EarningsChart';

const W = 600;
const H = 240;
const PAD = { l: 48, r: 16, t: 16, b: 28 };

const compact = (n) => `${getCurrency()}${n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : Math.round(n)}`;

// Cumulative earnings through the year as an area + line chart.
export default function TrendChart({ data, year }) {
  const monthly = MONTHS.map((_, i) => data.find((d) => d.month === i + 1)?.total || 0);
  const cumulative = monthly.reduce((acc, v) => [...acc, (acc.at(-1) || 0) + v], []);
  const max = Math.max(...cumulative, 1);

  const x = (i) => PAD.l + (i * (W - PAD.l - PAD.r)) / 11;
  const y = (v) => H - PAD.b - (v / max) * (H - PAD.t - PAD.b);
  const line = cumulative.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = `${line} L${x(11)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
  const ticks = [0, 1 / 3, 2 / 3, 1].map((t) => t * max);

  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">Running total in {year}</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Cumulative earnings by month">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} strokeWidth="1" className="stroke-rule" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" className="fill-muted">{compact(t)}</text>
          </g>
        ))}
        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" className="fill-muted">{m}</text>
        ))}
        <g key={`${year}-${max}`}>
          <path d={area} opacity="0.08" className="animate-fade fill-ink" />
          <path
            d={line}
            fill="none"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            className="animate-draw stroke-ink"
          />
          {cumulative.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={i === 11 ? 5 : 3} className={i === 11 ? 'fill-gold' : 'fill-ink'}>
              <title>{`${MONTHS[i]}: ${money(v)} so far`}</title>
            </circle>
          ))}
        </g>
      </svg>
    </section>
  );
}
