"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "../types";
import * as api from "../userApi"; // Update to use userApi for auth functions
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null; // Current authenticated user
  token: string | null; // Authentication token
  isAdmin: boolean; // Indicates if the user is an admin
  isLoading: boolean; // Loading state
  error: string | null; // Error message
  login: (email: string, password: string) => Promise<void>; // Login function
  register: (email: string, password: string, name: string) => Promise<void>; // Registration function
  logout: () => void; // Logout function
  updateProfile: (data: Partial<User>) => Promise<void>; // Profile update function
}

const AuthContext = createContext<AuthContextType | null>(null);

// Admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";

/**
 * AuthProvider component that provides authentication context to its children.
 *
 * @param children - The child components that will have access to the authentication context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserProfile = async (authToken: string) => {
      try {
        const userData = await api.getProfile(authToken);
        setUser(userData);
        setToken(authToken);
        setIsAdmin(userData.role === "admin");
      } catch (error) {
        console.error("Error loading user profile:", error);
        localStorage.removeItem("auth-token");
        setError("Session expired. Please login again.");
        toast({
          variant: "destructive",
          description: "Session expired. Please login again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      loadUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [toast]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check for admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 0,
          email: ADMIN_EMAIL,
          name: "Admin",
          role: "admin",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        } as User;
        setUser(adminUser);
        setToken("admin-token");
        setIsAdmin(true);
        localStorage.setItem("auth-token", "admin-token");
        return;
      }

      const auth: AuthResponse = await api.login(email, password);
      const userData = await api.getProfile(auth.access_token);

      setUser(userData);
      setToken(auth.access_token);
      setIsAdmin(userData.role === "admin");
      localStorage.setItem("auth-token", auth.access_token);
    } catch (err) {
      setError("Invalid credentials");
      toast({
        variant: "destructive",
        description: "Invalid credentials",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.register(email, password, name);
      const auth: AuthResponse = await api.login(email, password);
      const userData = await api.getProfile(auth.access_token);

      setUser(userData);
      setToken(auth.access_token);
      setIsAdmin(userData.role === "admin");
      localStorage.setItem("auth-token", auth.access_token);
    } catch (err) {
      setError("Registration failed");
      toast({
        variant: "destructive",
        description: "Registration failed",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("auth-token");
    toast({
      description: "Logged out successfully",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      // API call to update profile
      const updatedUser = await api.updateProfile(token, data);
      setUser(updatedUser);
      toast({
        description: "Profile updated successfully",
      });
    } catch (err) {
      setError("Failed to update profile");
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the AuthContext.
 *
 * @returns The authentication context.
 * @throws Error if used outside of AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
