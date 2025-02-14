/**
 * Represents the statistics for admin dashboard.
 */
export interface AdminStats {
  revenue: {
    total: number; // Total revenue amount.
    growth: number; // Growth percentage.
    breakdown: {
      period: string; // Time period for the breakdown.
      amount: number; // Revenue amount for the period.
    }[];
  };
  orders: {
    total: number; // Total number of orders.
    growth: number; // Growth percentage of orders.
    breakdown: {
      status: string; // Status of the orders (e.g., completed, pending).
      count: number; // Count of orders for the status.
    }[];
  };
  customers: {
    total: number; // Total number of customers.
    growth: number; // Growth percentage of customers.
    active: number; // Number of active customers.
    new: number; // Number of new customers.
  };
  inventory: {
    total: number; // Total number of products in inventory.
    lowStock: number; // Number of products with low stock.
    outOfStock: number; // Number of products that are out of stock.
  };
  conversionRate?: number; // Conversion rate, optional.
  revenueData?: {
    total: number; // Total revenue data.
    graph: { date: string; revenue: number }[]; // Graph data for revenue.
  };
}

/**
 * Represents the inventory statistics.
 */
export interface InventoryStats {
  products: {
    id: number; // Product ID.
    name: string; // Product name.
    stock: number; // Current stock level.
    reorderPoint: number; // Stock level at which to reorder.
    lastRestocked: string; // Date when the product was last restocked.
  }[];
  summary: {
    totalProducts: number; // Total number of products.
    lowStock: number; // Number of products with low stock.
    outOfStock: number; // Number of products that are out of stock.
    averageTurnover: number; // Average turnover rate of products.
  };
}

/**
 * Represents a sales forecast.
 */
export interface SalesForecast {
  period: string; // Time period for the forecast.
  predictedRevenue: number; // Predicted revenue for the period.
  predictedOrders: number; // Predicted number of orders for the period.
  confidence: number; // Confidence level of the forecast.
  factors: {
    name: string; // Name of the factor affecting the forecast.
    impact: number; // Impact level of the factor.
  }[];
}

/**
 * Represents a customer segment.
 */
export interface CustomerSegment {
  id: string; // Unique identifier for the segment.
  name: string; // Name of the customer segment.
  size: number; // Size of the segment (number of customers).
  averageOrderValue: number; // Average order value for the segment.
  purchaseFrequency: number; // Frequency of purchases by the segment.
  characteristics: {
    key: string; // Key characteristic of the segment.
    value: string; // Value of the characteristic.
  }[];
}

/**
 * Represents a batch update for products.
 */
export interface ProductBatchUpdate {
  id: number; // Product ID to update.
  changes: Partial<Product>; // Changes to apply to the product.
}

/**
 * Represents a batch update for orders.
 */
export interface OrderBatchUpdate {
  id: number; // Order ID to update.
  changes: Partial<Order>; // Changes to apply to the order.
}

/**
 * Represents the result of an import operation.
 */
export interface ImportResult {
  success: boolean; // Indicates if the import was successful.
  processed: number; // Number of products processed.
  failed: number; // Number of products that failed to import.
  errors?: {
    row: number; // Row number of the error in the import file.
    message: string; // Error message.
  }[]; // Optional array of errors encountered during import.
}

/**
 * Represents filters for exporting products.
 */
export interface ProductExportFilters {
  category?: string; // Optional category filter.
  minStock?: number; // Optional minimum stock filter.
  maxStock?: number; // Optional maximum stock filter.
  dateFrom?: string; // Optional start date for filtering.
  dateTo?: string; // Optional end date for filtering.
}

/**
 * Represents a product.
 */
export interface Product {
  id: number; // Unique identifier for the product.
  name: string; // Name of the product.
  price: number; // Price of the product.
  description: string; // Description of the product.
  category: string; // Category of the product.
  stock: number; // Current stock level of the product.
}

/**
 * Represents an order.
 */
export interface Order {
  id: number; // Unique identifier for the order.
  productId: number; // ID of the product ordered.
  quantity: number; // Quantity of the product ordered.
  status: string; // Current status of the order.
  createdAt: string; // Date when the order was created.
  updatedAt: string; // Date when the order was last updated.
}
