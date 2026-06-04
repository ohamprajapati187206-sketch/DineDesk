import client from './client';

export const getBookings = () => client.get('/bookings');
export const createBooking = (data) => client.post('/bookings', data);
export const updateBooking = (id, status) =>
  client.patch(`/bookings/${id}`, { status });