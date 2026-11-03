import api from './axios';

export const getProjects = (params) => api.get('/projects', { params }).then((r) => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then((r) => r.data);
export const createProject = (data) => api.post('/projects', data).then((r) => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data);
export const setProjectStatus = (id, status) => api.patch(`/projects/${id}/status`, { status }).then((r) => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);

// task checklist: every call returns the project's updated task list
export const addTask = (id, title) => api.post(`/projects/${id}/tasks`, { title }).then((r) => r.data);
export const updateTask = (id, taskId, data) => api.patch(`/projects/${id}/tasks/${taskId}`, data).then((r) => r.data);
export const deleteTask = (id, taskId) => api.delete(`/projects/${id}/tasks/${taskId}`).then((r) => r.data);
