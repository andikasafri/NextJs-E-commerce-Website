"use client";

import { AuthProvider } from "@/lib/contexts/auth-context"; // Adjust the import path as necessary
import { CartProvider } from "@/lib/contexts/cart-context"; // Adjust the import path as necessary

/**
 * AppProvider component that wraps the AuthProvider and CartProvider.
 *
 * @param children - The child components that will have access to the authentication and cart contexts.
 * @returns The combined context providers for authentication and cart management.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
