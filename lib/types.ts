// src/lib/types/types.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: number;
  title: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  stock?: number;
  ratings?: number;
  reviews?: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  size?: string;
  color?: string;
  stock: number;
  price?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  giftWrap?: boolean;
  estimatedDelivery?: string;
  productid: number;
}

export interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  selectedItems: number[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
  giftWrapFee: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  cart: CartItem[];
  wishlist: number[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  status: string;
  total: number;
  shipping: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod?: {
    type: string;
    lastFour?: string;
    expiryDate?: string;
  };
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
}

export interface AdminStats {
  revenue: {
    total: number;
    growth: number;
    breakdown: {
      period: string;
      amount: number;
    }[];
  };
  orders: {
    total: number;
    growth: number;
    breakdown: {
      status: string;
      count: number;
    }[];
  };
  customers: {
    total: number;
    growth: number;
    active: number;
    new: number;
  };
  inventory: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface InventoryStats {
  products: {
    id: number;
    name: string;
    stock: number;
    reorderPoint: number;
    lastRestocked: string;
  }[];
  summary: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    averageTurnover: number;
  };
}

export interface SalesForecast {
  period: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  characteristics: {
    key: string;
    value: string;
  }[];
}

export interface ProductBatchUpdate {
  id: number;
  changes: Partial<Product>;
}

export interface OrderBatchUpdate {
  id: number;
  changes: Partial<Order>;
}

export interface ImportResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: {
    row: number;
    message: string;
  }[];
}

export interface ProductExportFilters {
  category?: string;
  minStock?: number;
  maxStock?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface ApiErrorData {
  message?: string;
  details?: string;
}

// Define HomePageData based on your page.tsx structure
export type HomePageData = {
  products: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    stock?: number;
    ratings?: number;
    reviews?: number;
    variants?: ProductVariant[];
  }[];
  categories: {
    id: number;
    name: string;
    description?: string;
    image?: string;
  }[];
};
