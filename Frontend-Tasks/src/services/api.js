// src/services/api.js

import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const getTasks = () => axios.get(`${API_BASE}/tasks`);
export const addTask = (task) => axios.post(`${API_BASE}/tasks`, task);
export const updateTask = (id, task) => axios.put(`${API_BASE}/tasks/${id}`, task);
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`);
