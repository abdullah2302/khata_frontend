import { useQuery } from '@tanstack/react-query';
import { getClients, getClientOverview } from '../api/clientApi';
import { getProjects, getProject } from '../api/projectApi';
import { getInvoice } from '../api/invoiceApi';

// Shared lookups: every form that needs the client list reuses the same cached request.
export const useAllClients = () =>
  useQuery({ queryKey: ['clients', 'all'], queryFn: () => getClients({ limit: 100 }), select: (d) => d.items });

export const useClientProjects = (clientId) =>
  useQuery({
    queryKey: ['projects', 'of-client', clientId],
    queryFn: () => getProjects({ client: clientId, limit: 100 }),
    enabled: Boolean(clientId),
    select: (d) => d.items
  });

export const useClientOverview = (id) => useQuery({ queryKey: ['client', id], queryFn: () => getClientOverview(id) });
export const useProject = (id) => useQuery({ queryKey: ['project', id], queryFn: () => getProject(id) });
export const useInvoice = (id) => useQuery({ queryKey: ['invoice', id], queryFn: () => getInvoice(id) });