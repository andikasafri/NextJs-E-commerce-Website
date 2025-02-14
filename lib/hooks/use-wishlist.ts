// hooks/use-wishlist.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth";

interface WishlistState {
  // Mapping from user ID to an array of product IDs
  items: Record<number, number[]>;
  addItem: (userId: number, productId: number) => void;
  removeItem: (userId: number, productId: number) => void;
  hasItem: (userId: number, productId: number) => boolean;
  getItems: (userId: number) => number[];
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (userId, productId) => {
        set((state) => {
          const userWishlist = state.items[userId] || [];
          // Avoid adding duplicate products
          if (!userWishlist.includes(productId)) {
            return {
              items: {
                ...state.items,
                [userId]: [...userWishlist, productId],
              },
            };
          }
          return state;
        });
      },
      removeItem: (userId, productId) => {
        set((state) => ({
          items: {
            ...state.items,
            [userId]: (state.items[userId] || []).filter(
              (id) => id !== productId
            ),
          },
        }));
      },
      hasItem: (userId, productId) => {
        const userWishlist = get().items[userId] || [];
        return userWishlist.includes(productId);
      },
      getItems: (userId) => {
        return get().items[userId] || [];
      },
    }),
    {
      name: "wishlist-storage", // key to persist wishlist state in localStorage
      // Optionally add a custom serialize/deserialize method here if needed.
    }
  )
);

/**
 * Custom hook to access wishlist functionality while checking authentication.
 * If there is no authenticated user, dummy functions and an empty wishlist are returned.
 */
export function useAuthWishlist() {
  const { user } = useAuth();
  const wishlist = useWishlist();

  return useMemo(() => {
    if (!user) {
      return {
        items: [],
        addItem: (_productId: number) => {},
        removeItem: (_productId: number) => {},
        hasItem: (_productId: number) => false,
      };
    }

    return {
      items: wishlist.getItems(user.id),
      addItem: (productId: number) => wishlist.addItem(user.id, productId),
      removeItem: (productId: number) =>
        wishlist.removeItem(user.id, productId),
      hasItem: (productId: number) => wishlist.hasItem(user.id, productId),
    };
  }, [user, wishlist]);
}
