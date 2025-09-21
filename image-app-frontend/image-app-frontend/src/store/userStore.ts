import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface UserStore {
  auth: AuthData | null;
  setAuth: (auth: AuthData) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
      logout: () => {
        localStorage.removeItem("token"); // optional
        set({ auth: null });
      },
      isAuthenticated: () => !!get().auth?.accessToken,
    }),
    { name: "auth-storage" } // stored in localStorage
  )
);
