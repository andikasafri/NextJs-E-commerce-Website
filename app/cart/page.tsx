'use client';

import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { CartSkeleton } from "@/components/cart/cart-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";

// Lazy load components
const CartItems = lazy(() => import("@/components/cart/cart-items"));
const CartSummary = lazy(() => import("@/components/cart/cart-summary"));
const SavedItems = lazy(() => import("@/components/cart/saved-items"));

export default function CartPage() {
  const { items, savedItems } = useCart();

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some products to your cart to continue shopping
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<CartSkeleton />}>
              <CartItems />
              {savedItems.length > 0 && <SavedItems />}
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<CartSkeleton />}>
              <CartSummary />
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}