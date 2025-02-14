import { User, AuthResponse, UserPreferences } from "./types";
const API_URL = "https://api.escuelajs.co/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      name,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg",
    }),
  });
  return handleResponse<User>(res);
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<User>(res);
}

export async function updateProfile(token: string, data: Partial<User>) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}

export async function updateUserPreferences(
  token: string,
  preferences: Partial<UserPreferences>
) {
  const res = await fetch(`${API_URL}/users/preferences`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });
  return handleResponse<UserPreferences>(res);
}
