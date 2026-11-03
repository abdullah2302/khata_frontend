import api from './axios';

export const getInvoices = (params) => api.get('/invoices', { params }).then((r) => r.data);
export const getInvoice = (id) => api.get(`/invoices/${id}`).then((r) => r.data);
export const createInvoice = (data) => api.post('/invoices', data).then((r) => r.data);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data).then((r) => r.data);
export const markInvoicePaid = (id) => api.patch(`/invoices/${id}/paid`).then((r) => r.data);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`).then((r) => r.data);
export const duplicateInvoice = (id) => api.post(`/invoices/${id}/duplicate`).then((r) => r.data);
