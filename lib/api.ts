import {
  Category,
  Order,
  Product,
  User,
  AuthResponse,
  UserPreferences,
} from "./types";

const API_URL = "https://api.escuelajs.co/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || "API Error", error);
  }
  return response.json();
}

export async function handleApiError(error: unknown) {
  if (error instanceof Response) {
    const data = await error.json();
    throw new ApiError(error.status, data.message || "API Error", data);
  }
  if (error instanceof ApiError) {
    throw error;
  }
  throw new Error("Unknown error occurred");
}

// Server-side fetching with caching
export async function getProducts(offset = 0, limit = 10) {
  try {
    const res = await fetch(
      `${API_URL}/products?offset=${offset}&limit=${limit}`,
      {
        next: { revalidate: 3600 },
      }
    );
    return handleResponse<Product[]>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getProduct(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 },
    });
    return handleResponse<Product>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 86400 },
    });
    return handleResponse<Category[]>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

// Admin API endpoints
export async function getStats() {
  try {
    const res = await fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 300 },
    });
    return handleResponse<Record<string, unknown>>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 60 },
    });
    return handleResponse<Order[]>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

// Authentication endpoints
export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function register(email: string, password: string, name: string) {
  try {
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
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getProfile(token: string) {
  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    return handleResponse<User>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProfile(token: string, data: Partial<User>) {
  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUserPreferences(
  token: string,
  preferences: Partial<UserPreferences>
) {
  try {
    const res = await fetch(`${API_URL}/users/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
    return handleResponse<UserPreferences>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProduct(id: number, data: Partial<Product>) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  } catch (error) {
    throw handleApiError(error);
  }
}
