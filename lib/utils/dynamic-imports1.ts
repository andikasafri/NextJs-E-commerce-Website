// import dynamic from "next/dynamic";
// import { LoadingSpinner } from "@components/loading-spinner"; // Ensure this is a valid React component

// // Explicitly type the `loading` option
// const loading = () => <LoadingSpinner />;

// // Admin components - large and route-specific
// export const DynamicCustomerSegments = dynamic(
//   () =>
//     import("@components/admin/analytics/customer-segments").then((mod) => ({
//       default: mod.CustomerSegments,
//     })),
//   {
//     loading, // Use the explicitly typed `loading` function
//     ssr: false,
//   }
// );

// export const DynamicSalesForecast = dynamic(
//   () =>
//     import("@components/admin/analytics/sales-forecast").then((mod) => ({
//       default: mod.SalesForecastChart,
//     })),
//   {
//     loading, // Use the explicitly typed `loading` function
//     ssr: false,
//   }
// );

// export const DynamicInventoryManagement = dynamic(
//   () =>
//     import("@components/admin/inventory/inventory-management").then((mod) => ({
//       default: mod.InventoryManagement,
//     })),
//   {
//     loading, // Use the explicitly typed `loading` function
//     ssr: false,
//   }
// );

// // Cart components - loaded on interaction
// export const DynamicCartItems = dynamic(
//   () => import("@components/cart/cart-items"),
//   {
//     suspense: true,
//   }
// );

// export const DynamicCartSummary = dynamic(
//   () => import("@components/cart/cart-summary"),
//   {
//     suspense: true,
//   }
// );

// // Product components - loaded when in viewport
// export const DynamicProductGrid = dynamic(
//   () => import("@components/product-grid"),
//   {
//     suspense: true,
//   }
// );
