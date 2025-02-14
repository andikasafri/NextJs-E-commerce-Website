import { Category } from "./types";
const API_URL = "https://api.escuelajs.co/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return handleResponse<Category[]>(res);
}
