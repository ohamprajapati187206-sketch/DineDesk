import client from './client';

export const getInventory = () => client.get('/inventory');
export const addInventoryItem = (data) => client.post('/inventory', data);
export const updateStock = (id, currentStock) =>
  client.patch(`/inventory/${id}`, { currentStock });