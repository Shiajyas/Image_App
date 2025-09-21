// src/api/axios.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", 
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const state = useUserStore.getState();
  if (state.auth?.accessToken) {
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }
  return config;
});

// Response interceptor: return only data.data
api.interceptors.response.use(
  (response) => {
    console.log(response.data, "response");
    return response.data; // ✅ Only return payload (not message/success/etc.)
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
