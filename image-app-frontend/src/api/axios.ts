// src/api/axios.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: attach accessToken
api.interceptors.request.use((config) => {
  const state = useUserStore.getState();
  if (state.auth?.accessToken) {
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }
  return config;
});

// Response interceptor: handle refresh token if needed
api.interceptors.response.use(
  (response) => response.data, // return only payload
  async (error) => {
    const originalRequest = error.config;
    const state = useUserStore.getState();

    // If 401 unauthorized, try refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      state.auth?.refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken: state.auth.refreshToken }
        );
        const { accessToken } = refreshResponse.data;

        // Update store
        useUserStore.setState({ auth: { ...state.auth, accessToken } });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Logout if refresh fails
        useUserStore.setState({ auth: null });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
