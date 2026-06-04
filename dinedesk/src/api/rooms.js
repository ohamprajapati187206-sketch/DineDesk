import client from './client';

export const getRooms = () => client.get('/rooms');
export const addRoom = (data) => client.post('/rooms', data);
export const updateRoomStatus = (id, status) =>
  client.patch(`/rooms/${id}/status`, { status });