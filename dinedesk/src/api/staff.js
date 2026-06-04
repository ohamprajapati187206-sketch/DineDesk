import client from './client';

export const getStaff = () => client.get('/staff');
export const addStaff = (data) => client.post('/staff', data);
export const markAttendance = (id, status) =>
  client.patch(`/staff/${id}/attendance`, { status });