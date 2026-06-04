import client from './client';

export const getMenu = () => client.get('/menu');
export const addMenuItem = (data) => client.post('/menu', data);
export const updateMenuItem = (id, data) => client.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => client.delete(`/menu/${id}`);