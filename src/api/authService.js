import axiosInstance from './axiosInstance';

export const adminLogin = (email, password) =>
  axiosInstance.post('/auth/admin/login', { email, password }).then((res) => res.data.data);

export const trainerLogin = (email, password) =>
  axiosInstance.post('/auth/trainer/login', { email, password }).then((res) => res.data.data);

export const getMe = () => axiosInstance.get('/auth/me').then((res) => res.data.data);
