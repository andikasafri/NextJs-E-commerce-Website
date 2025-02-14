import { ApiErrorData, Product } from "@/lib/types";

const API_URL = "https://api.escuelajs.co/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: ApiErrorData
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

async function handleApiError(error: unknown) {
  if (error instanceof Response) {
    const data = await error.json();
    throw new ApiError(error.status, data.message || "API Error", data);
  }
  if (error instanceof ApiError) {
    throw error;
  }
  throw new Error("Unknown error occurred");
}

export async function getProducts(
  offset: number,
  limit: number
): Promise<Product[]> {
  const res = await fetch(
    `${API_URL}/products?offset=${offset}&limit=${limit}`
  );
  return handleResponse<Product[]>(res);
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
