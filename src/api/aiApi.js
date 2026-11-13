import api from './axios';

// AI calls can take a few seconds (web search + model), so they get a longer timeout.
const slow = { timeout: 45000 };

export const writeReminder = (data) => api.post('/ai/reminder', data, slow).then((r) => r.data);
export const getClientBrief = (clientId) => api.get(`/ai/client-brief/${clientId}`).then((r) => r.data);
export const createClientBrief = (clientId) => api.post(`/ai/client-brief/${clientId}`, null, slow).then((r) => r.data);