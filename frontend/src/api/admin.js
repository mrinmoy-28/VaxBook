import client from './client';

export const getStats = () => client.get('/admin/stats').then(r => r.data);
export const getBookingsByDay = (params) => client.get('/admin/bookings', { params }).then(r => r.data);
export const createAdmin = (data) => client.post('/admin/create-admin', data).then(r => r.data);
