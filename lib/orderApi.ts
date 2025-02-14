import { Order } from "./types";
const API_URL = "https://api.escuelajs.co/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return handleResponse<Order[]>(res);
}

export async function updateOrderStatus(orderId: number, status: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Order>(res);
}
