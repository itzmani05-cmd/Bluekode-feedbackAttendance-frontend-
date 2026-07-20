import axiosInstance from './axiosInstance';

export const getStudents = (params) => axiosInstance.get('/students', { params }).then((res) => res.data);

export const getStudentById = (id) => axiosInstance.get(`/students/${id}`).then((res) => res.data.data);

export const createStudent = (payload) => axiosInstance.post('/students', payload).then((res) => res.data.data);

export const updateStudent = (id, payload) =>
  axiosInstance.put(`/students/${id}`, payload).then((res) => res.data.data);

export const deleteStudent = (id) => axiosInstance.delete(`/students/${id}`).then((res) => res.data);

export const getMyStudents = () => axiosInstance.get('/students/my-students').then((res) => res.data.data);

export const getBatches = () => axiosInstance.get('/students/batches').then((res) => res.data.data);
