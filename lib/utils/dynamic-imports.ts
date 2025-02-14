import { CustomerSegments } from "@components/admin/analytics/customer-segments";
import { SalesForecastChart } from "@components/admin/analytics/sales-forecast";
import { InventoryManagement } from "@components/admin/inventory/inventory-management";
import CartItems from "@components/cart/cart-items";
import CartSummary from "@components/cart/cart-summary";
import ProductGrid from "@components/product-grid";

// Admin components - large and route-specific
export const DynamicCustomerSegments = CustomerSegments;

export const DynamicSalesForecast = SalesForecastChart;

export const DynamicInventoryManagement = InventoryManagement;

// Cart components - loaded on interaction
export const DynamicCartItems = CartItems;

export const DynamicCartSummary = CartSummary;

// Product components - loaded when in viewport
export const DynamicProductGrid = ProductGrid;
