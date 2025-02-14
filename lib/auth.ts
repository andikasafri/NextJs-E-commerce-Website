import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthResponse } from "./types"; // Adjust the relative path if needed
import {
  login as userApiLogin,
  register as userApiRegister,
  getProfile as userApiGetProfile,
  updateProfile as userApiUpdateProfile,
} from "./userApi"; // Import functions directly from the correct module

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,
      login: async (email: string, password: string) => {
        // Check for admin login
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({
            user: {
              id: 0,
              email: ADMIN_EMAIL,
              name: "Admin",
              role: "admin",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
              cart: [],
              wishlist: [],
            },
            token: "admin-token",
            isAdmin: true,
          });
          return;
        }

        const auth: AuthResponse = await userApiLogin(email, password);
        const user = await userApiGetProfile(auth.access_token);
        set({
          user: { ...user, wishlist: [] },
          token: auth.access_token,
          isAdmin: false,
        });
      },
      register: async (email: string, password: string, name: string) => {
        await userApiRegister(email, password, name);
        const auth: AuthResponse = await userApiLogin(email, password);
        const user = await userApiGetProfile(auth.access_token);
        set({
          user: { ...user, wishlist: [] },
          token: auth.access_token,
          isAdmin: false,
        });
      },
      logout: () => set({ user: null, token: null, isAdmin: false }),
      updateProfile: async (data: Partial<User>) => {
        const state = useAuth.getState();
        if (!state.token || !state.user) throw new Error("Not authenticated");

        const updatedUser = await userApiUpdateProfile(state.token, data);
        set({ user: { ...state.user, ...updatedUser } });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
