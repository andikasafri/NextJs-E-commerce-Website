import { ApiError } from "../api";
import {
  AdminStats,
  InventoryStats,
  SalesForecast,
  CustomerSegment,
  ProductBatchUpdate,
  OrderBatchUpdate,
  ImportResult,
  ProductExportFilters,
  Product,
  Order,
} from "./types";

const ADMIN_API_URL = "https://api.escuelajs.co/api/v1/admin";

/**
 * Handles the response from the API, throwing an error if the response is not ok.
 *
 * @param response - The response object from the fetch call.
 * @returns The parsed JSON response.
 * @throws ApiError if the response is not ok.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || "Admin API Error",
      error
    );
  }
  return response.json();
}

/**
 * Fetches admin statistics for a given period.
 *
 * @param period - The time period for which to fetch stats (default is "week").
 * @returns AdminStats object containing statistics.
 * @throws ApiError if the fetch fails.
 */
export async function getAdminStats(period: string = "week") {
  try {
    const res = await fetch(`${ADMIN_API_URL}/stats?period=${period}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 300 },
    });
    return handleResponse<AdminStats>(res);
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw new ApiError(500, "Failed to fetch admin stats");
  }
}

/**
 * Fetches inventory statistics.
 *
 * @returns InventoryStats object containing inventory data.
 * @throws ApiError if the fetch fails.
 */
export async function getInventoryStats() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 300 },
    });
    return handleResponse<InventoryStats>(res);
  } catch (error) {
    console.error("Failed to fetch inventory stats:", error);
    throw new ApiError(500, "Failed to fetch inventory stats");
  }
}

/**
 * Fetches sales forecasts.
 *
 * @returns An array of SalesForecast objects.
 * @throws ApiError if the fetch fails.
 */
export async function getSalesForecasts() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/forecasts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 3600 },
    });
    return handleResponse<SalesForecast[]>(res);
  } catch (error) {
    console.error("Failed to fetch sales forecasts:", error);
    throw new ApiError(500, "Failed to fetch sales forecasts");
  }
}

/**
 * Fetches customer segments.
 *
 * @returns An array of CustomerSegment objects.
 * @throws ApiError if the fetch fails.
 */
export async function getCustomerSegments() {
  try {
    const res = await fetch(`${ADMIN_API_URL}/customer-segments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      next: { revalidate: 3600 },
    });
    return handleResponse<CustomerSegment[]>(res);
  } catch (error) {
    console.error("Failed to fetch customer segments:", error);
    throw new ApiError(500, "Failed to fetch customer segments");
  }
}

/**
 * Batch updates products.
 *
 * @param updates - An array of ProductBatchUpdate objects containing product updates.
 * @returns An array of updated Product objects.
 * @throws ApiError if the fetch fails.
 */
export async function batchUpdateProducts(updates: ProductBatchUpdate[]) {
  try {
    const res = await fetch(`${ADMIN_API_URL}/products/batch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ updates }),
    });
    return handleResponse<Product[]>(res);
  } catch (error) {
    console.error("Failed to batch update products:", error);
    throw new ApiError(500, "Failed to batch update products");
  }
}

/**
 * Batch updates orders.
 *
 * @param updates - An array of OrderBatchUpdate objects containing order updates.
 * @returns An array of updated Order objects.
 * @throws ApiError if the fetch fails.
 */
export async function batchUpdateOrders(updates: OrderBatchUpdate[]) {
  try {
    const res = await fetch(`${ADMIN_API_URL}/orders/batch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ updates }),
    });
    return handleResponse<Order[]>(res);
  } catch (error) {
    console.error("Failed to batch update orders:", error);
    throw new ApiError(500, "Failed to batch update orders");
  }
}

/**
 * Imports products from a file.
 *
 * @param file - The file to import products from.
 * @returns ImportResult object containing the result of the import.
 * @throws ApiError if the fetch fails.
 */
export async function importProducts(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${ADMIN_API_URL}/products/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    return handleResponse<ImportResult>(res);
  } catch (error) {
    console.error("Failed to import products:", error);
    throw new ApiError(500, "Failed to import products");
  }
}

/**
 * Exports products based on filters.
 *
 * @param filters - Optional filters for exporting products.
 * @returns A Blob containing the exported products.
 * @throws ApiError if the fetch fails.
 */
export async function exportProducts(filters?: ProductExportFilters) {
  try {
    const queryString = filters
      ? `?${new URLSearchParams(filters as unknown as Record<string, string>)}`
      : "";
    const res = await fetch(`${ADMIN_API_URL}/products/export${queryString}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.blob();
  } catch (error) {
    console.error("Failed to export products:", error);
    throw new ApiError(500, "Failed to export products");
  }
}
