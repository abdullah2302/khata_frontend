import { useQuery } from '@tanstack/react-query';
import {
  getSummary, getMonthlyEarnings, getBilledVsPaid, getPendingByClient,
  getUpcoming, getTopClients, getProjectsByStatus, getBudgetUsage
} from '../api/statsApi';

const stat = (name, fn, ...args) => ({ queryKey: ['stats', name, ...args], queryFn: () => fn(...args) });

export const useSummary = () => useQuery(stat('summary', getSummary));
export const useMonthlyEarnings = (year) => useQuery(stat('monthly', getMonthlyEarnings, year));
export const useBilledVsPaid = (year) => useQuery(stat('billed', getBilledVsPaid, year));
export const usePendingByClient = () => useQuery(stat('pending', getPendingByClient));
export const useUpcoming = () => useQuery(stat('upcoming', getUpcoming));
export const useTopClients = () => useQuery(stat('top', getTopClients));
export const useProjectsByStatus = () => useQuery(stat('projects', getProjectsByStatus));
export const useBudgetUsage = () => useQuery(stat('budget', getBudgetUsage));