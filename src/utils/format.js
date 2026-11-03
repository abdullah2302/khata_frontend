export const CURRENCIES = [
  { symbol: '$', label: 'US Dollar ($)' },
  { symbol: 'Rs ', label: 'Pakistani Rupee (Rs)' },
  { symbol: '€', label: 'Euro (€)' },
  { symbol: '£', label: 'British Pound (£)' },
  { symbol: 'AED ', label: 'UAE Dirham (AED)' }
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
