import axios from 'axios'
import React from 'react'

export const API = axios.create({
  baseURL : "https://todoapp-react-backend-yumj.onrender.com",
  // baseURL : "http://localhost:5000"
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

