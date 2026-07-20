import axiosInstance from './axiosInstance';

export const getDashboard = () => axiosInstance.get('/dashboard').then((res) => res.data.data);
