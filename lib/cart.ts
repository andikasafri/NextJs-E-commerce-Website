"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem, ProductVariant } from "@/lib/types";

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  products: Product[];
  wishlist: Product[];
  selectedItems: number[];
  discountCode: string | null;
  discountAmount: number;
  shipping: number;
  subtotal: number;
  total: number;
  giftWrapFee: number;
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (productId: number) => void;
  removeSelectedItems: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  toggleGiftWrap: (productId: number) => void;
  toggleItemSelection: (productId: number) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  moveSelectedToWishlist: () => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
  clearCart: () => void;
}

const GIFT_WRAP_FEE = 5;
const DISCOUNT_CODES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

function calculateEstimatedDelivery(): string {
  const today = new Date();
  const deliveryDate = new Date(today.setDate(today.getDate() + 3));
  const maxDeliveryDate = new Date(today.setDate(today.getDate() + 2));
  return `${deliveryDate.toLocaleDateString()} - ${maxDeliveryDate.toLocaleDateString()}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      products: [],
      wishlist: [],
      selectedItems: [],
      discountCode: null,
      discountAmount: 0,
      shipping: 0,
      subtotal: 0,
      total: 0,
      giftWrapFee: 0,

      addItem: (product, variant) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.id === product.id && item.selectedVariant?.id === variant?.id
          );

          const newItems = existingItem
            ? state.items.map((item) =>
                item.id === product.id &&
                item.selectedVariant?.id === variant?.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [
                ...state.items,
                {
                  ...product,
                  quantity: 1,
                  selectedVariant: variant,
                  estimatedDelivery: calculateEstimatedDelivery(),
                  productid: product.id, // Ensure productid is included
                },
              ];

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            items: newItems,
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          const newSelectedItems = state.selectedItems.filter(
            (id) => id !== productId
          );

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            items: newItems,
            selectedItems: newSelectedItems,
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      removeSelectedItems: () => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => !state.selectedItems.includes(item.id)
          );

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            items: newItems,
            selectedItems: [],
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            items: newItems,
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      toggleGiftWrap: (productId) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === productId ? { ...item, giftWrap: !item.giftWrap } : item
          );

          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const total =
            state.subtotal +
            state.shipping +
            giftWrapFee -
            state.subtotal * state.discountAmount;

          return {
            items: newItems,
            giftWrapFee,
            total,
          };
        });
      },

      toggleItemSelection: (productId) => {
        set((state) => {
          const isSelected = state.selectedItems.includes(productId);
          const newSelectedItems = isSelected
            ? state.selectedItems.filter((id) => id !== productId)
            : [...state.selectedItems, productId];

          return {
            selectedItems: newSelectedItems,
          };
        });
      },

      selectAllItems: () => {
        set((state) => ({
          selectedItems: state.items.map((item) => item.id),
        }));
      },

      deselectAllItems: () => {
        set({ selectedItems: [] });
      },

      moveSelectedToWishlist: () => {
        const { selectedItems, products, wishlist } = get();
        selectedItems.forEach((id) => {
          // Implement wishlist logic here
          const product = products.find((item: Product) => item.id === id); // Find the product by ID
          if (product) {
            wishlist.push(product); // Add to wishlist
          }
        });
        get().removeSelectedItems();
      },

      saveForLater: (productId) => {
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (!item) return state;

          const newItems = state.items.filter((item) => item.id !== productId);
          const newSelectedItems = state.selectedItems.filter(
            (id) => id !== productId
          );

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            items: newItems,
            savedItems: [...state.savedItems, item],
            selectedItems: newSelectedItems,
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      moveToCart: (productId) => {
        set((state) => {
          const item = state.savedItems.find((item) => item.id === productId);
          if (!item) return state;

          const newSavedItems = state.savedItems.filter(
            (item) => item.id !== productId
          );
          const newItems = [
            ...state.items,
            { ...item, estimatedDelivery: calculateEstimatedDelivery() },
          ];

          const subtotal = newItems.reduce(
            (sum, item) =>
              sum + (item.selectedVariant?.price || item.price) * item.quantity,
            0
          );
          const giftWrapFee = newItems.reduce(
            (sum, item) =>
              sum + (item.giftWrap ? GIFT_WRAP_FEE * item.quantity : 0),
            0
          );
          const shipping = subtotal > 100 ? 0 : 10;
          const total =
            subtotal + shipping + giftWrapFee - subtotal * state.discountAmount;

          return {
            savedItems: newSavedItems,
            items: newItems,
            subtotal,
            shipping,
            total,
            giftWrapFee,
          };
        });
      },

      applyDiscount: (code) => {
        set((state) => {
          const discount = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES];
          if (!discount) return state;

          const discountAmount = discount;
          const total =
            state.subtotal +
            state.shipping +
            state.giftWrapFee -
            state.subtotal * discountAmount;

          return {
            discountCode: code,
            discountAmount,
            total,
          };
        });
      },

      removeDiscount: () => {
        set((state) => ({
          discountCode: null,
          discountAmount: 0,
          total: state.subtotal + state.shipping + state.giftWrapFee,
        }));
      },

      clearCart: () =>
        set({
          items: [],
          savedItems: [],
          selectedItems: [],
          discountCode: null,
          discountAmount: 0,
          subtotal: 0,
          shipping: 0,
          total: 0,
          giftWrapFee: 0,
        }),
    }),
    {
      name: "cart-storage",
    }
  )
);
