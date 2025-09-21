import api from "../api/axios";

export const AuthService = {
  register: (data: any) => api.post("/users/register", data),
  login: (data: any) => api.post("/users/login", data),

  // Change password for logged-in user
  updatePassword: (data: { userId: string; currentPassword: string; newPassword: string }) =>
    api.put("/users/change-password", data),

  // Optional: password reset by email (forgot password)
  resetPassword: (email: string) => api.post("/users/reset-password", { email }),
};
