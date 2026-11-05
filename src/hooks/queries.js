import { useQuery } from '@tanstack/react-query';
import { getClients, getClientOverview } from '../api/clientApi';
import { getProjects, getProject } from '../api/projectApi';
import { getInvoice } from '../api/invoiceApi';

// Shared lookups: every form that needs these lists reuses the same cached request.
export const useAllClients = () =>
  useQuery({ queryKey: ['clients', 'all'], queryFn: () => getClients({ limit: 100 }), select: (d) => d.items });

// Every project comes with its client and its price figures (price, invoiced, remaining).
export const useAllProjects = () =>
  useQuery({ queryKey: ['projects', 'all'], queryFn: () => getProjects({ limit: 100 }), select: (d) => d.items });

export const useClientOverview = (id) => useQuery({ queryKey: ['client', id], queryFn: () => getClientOverview(id) });
export const useProject = (id) => useQuery({ queryKey: ['project', id], queryFn: () => getProject(id) });
export const useInvoice = (id) => useQuery({ queryKey: ['invoice', id], queryFn: () => getInvoice(id) });