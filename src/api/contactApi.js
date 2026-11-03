import api from './axios';

export const sendMessage = (data) => api.post('/contact', data).then((r) => r.data);
