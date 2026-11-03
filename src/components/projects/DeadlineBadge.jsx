import { deadlineInfo, fmtDate } from '../../utils/format';

const tones = { late: 'text-margin font-semibold', soon: 'text-amber-700 font-semibold', ok: 'text-muted' };

// The deadline date with a live countdown ("in 5 days", "2 days overdue").
export default function DeadlineBadge({ date, status }) {
  if (!date) return <span className="text-muted">-</span>;
  if (status === 'completed' || status === 'cancelled') return <span>{fmtDate(date)}</span>;
  const { text, tone } = deadlineInfo(date);
  return (
    <span>
      {fmtDate(date)}
      <span className={`block text-xs ${tones[tone]}`}>{text}</span>
    </span>
  );
}
