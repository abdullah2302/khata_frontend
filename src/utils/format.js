export const CURRENCIES = [
  { symbol: '$', label: 'US Dollar ($)' },
  { symbol: 'Rs ', label: 'Pakistani Rupee (Rs)' },
  { symbol: '€', label: 'Euro (€)' },
  { symbol: '£', label: 'British Pound (£)' },
  { symbol: 'AED ', label: 'UAE Dirham (AED)' },
  { symbol: '₹', label: 'Indian Rupee (₹)' },
  { symbol: '₱', label: 'Philippine Peso (₱)' },
  { symbol: '₩', label: 'South Korean Won (₩)' },
  { symbol: '¥', label: 'Japanese Yen (¥)' }
];

export const getCurrency = () => localStorage.getItem('currency') ?? '$';
export const setCurrency = (symbol) => localStorage.setItem('currency', symbol);

export const money = (n) => `${getCurrency()}${Number(n || 0).toLocaleString()}`;

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export const fromNow = (d) => {
  const days = Math.ceil((new Date(d) - Date.now()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
};

export const orDash = (v) => v || '-';

export const errorMessage = (e) =>
  e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Could not reach the server.';

export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// "3 days overdue", "due today", "in 5 days" for a project deadline
export const deadlineInfo = (d) => {
  const due = new Date(d);
  const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((dueDay - today) / 86400000);
  if (days < 0) return { text: `${-days} ${-days === 1 ? 'day' : 'days'} overdue`, tone: 'late' };
  if (days === 0) return { text: 'due today', tone: 'soon' };
  if (days === 1) return { text: 'due tomorrow', tone: 'soon' };
  return { text: `in ${days} days`, tone: days <= 3 ? 'soon' : 'ok' };
};
