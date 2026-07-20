import axiosInstance from './axiosInstance';

export const validateFeedbackToken = (token) =>
  axiosInstance.get(`/feedback/token/${token}`).then((res) => res.data.data);

export const submitFeedback = (token, payload) =>
  axiosInstance.post(`/feedback/token/${token}`, payload).then((res) => res.data);

export const getAllFeedback = (params) => axiosInstance.get('/feedback', { params }).then((res) => res.data);

export const getTrainerRatings = () => axiosInstance.get('/feedback/trainer-ratings').then((res) => res.data.data);
