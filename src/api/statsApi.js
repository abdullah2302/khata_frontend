import api from './axios';

export const getSummary = () => api.get('/stats/summary').then((r) => r.data);
export const getMonthlyEarnings = (year) => api.get('/stats/monthly-earnings', { params: { year } }).then((r) => r.data);
export const getPendingByClient = () => api.get('/stats/pending-by-client').then((r) => r.data);
export const getTopClients = () => api.get('/stats/top-clients').then((r) => r.data);
export const getProjectsByStatus = () => api.get('/stats/projects-by-status').then((r) => r.data);
export const getUpcoming = () => api.get('/stats/upcoming').then((r) => r.data);
export const getBilledVsPaid = (year) => api.get('/stats/billed-vs-paid', { params: { year } }).then((r) => r.data);
export const getBudgetUsage = () => api.get('/stats/budget-usage').then((r) => r.data);
