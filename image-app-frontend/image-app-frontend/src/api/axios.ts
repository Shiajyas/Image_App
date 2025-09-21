// src/api/axios.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", 
});

api.interceptors.request.use((config) => {
  const state = useUserStore.getState();
  if (state.auth?.accessToken) {
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;
//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const state = useUserStore.getState();
//       try {
//         const refreshRes = await axios.post( import.meta.env.VITE_API_BASE_URL + "/auth/refresh", {
//           token: state.auth?.refreshToken,
//         });

//         // update tokens
//         const newAuth = {
//           ...state.auth!,
//           accessToken: refreshRes.data.accessToken,
//         };
//         useUserStore.getState().setAuth(newAuth);

//         originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
//         return api(originalRequest);
//       } catch {
//         state.logout();
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
