import client from './client';

export const getOrders = () => client.get('/orders');
export const createOrder = (data) => client.post('/orders', data);
export const updateOrderStatus = (id, status) =>
  client.patch(`/orders/${id}/status`, { status });