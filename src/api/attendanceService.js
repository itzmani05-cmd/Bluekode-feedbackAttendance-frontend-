import axiosInstance from './axiosInstance';

export const markAttendance = (payload) => axiosInstance.post('/attendance', payload).then((res) => res.data.data);

export const getAttendanceStatus = (date) =>
  axiosInstance.get('/attendance/status', { params: { date } }).then((res) => res.data.data);

export const getAttendanceReports = (params) =>
  axiosInstance.get('/attendance', { params }).then((res) => res.data);

export const getAttendanceById = (id) => axiosInstance.get(`/attendance/${id}`).then((res) => res.data.data);
