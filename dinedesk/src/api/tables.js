import client from './client';

export const getTables = () => client.get('/tables');
export const addTable = (data) => client.post('/tables', data);
export const updateTableStatus = (id, status) =>
  client.patch(`/tables/${id}/status`, { status });