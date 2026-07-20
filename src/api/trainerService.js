import axiosInstance from './axiosInstance';

export const getTrainers = (params) => axiosInstance.get('/trainers', { params }).then((res) => res.data);

export const getTrainerById = (id) => axiosInstance.get(`/trainers/${id}`).then((res) => res.data.data);

export const createTrainer = (payload) => axiosInstance.post('/trainers', payload).then((res) => res.data.data);

export const updateTrainer = (id, payload) =>
  axiosInstance.put(`/trainers/${id}`, payload).then((res) => res.data.data);

export const deleteTrainer = (id) => axiosInstance.delete(`/trainers/${id}`).then((res) => res.data);
