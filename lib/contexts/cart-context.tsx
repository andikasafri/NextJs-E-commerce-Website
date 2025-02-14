"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { Product, CartItem } from "@/lib/types"; // Adjust the import path as necessary
import { useToast } from "@/hooks/use-toast"; // Adjust the import path as necessary

interface CartState {
  items: CartItem[]; // Array of items in the cart
  savedItems: CartItem[]; // Array of saved items
  discountCode: string | null; // Current discount code applied
  discountAmount: number; // Amount of discount applied
  shipping: number; // Shipping cost
  subtotal: number; // Subtotal of items in the cart
  total: number; // Total cost including shipping and discounts
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product } // Action to add an item
  | { type: "REMOVE_ITEM"; payload: number } // Action to remove an item by ID
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } } // Action to update item quantity
  | { type: "SAVE_FOR_LATER"; payload: number } // Action to save an item for later
  | { type: "MOVE_TO_CART"; payload: number } // Action to move an item back to the cart
  | { type: "APPLY_DISCOUNT"; payload: string } // Action to apply a discount code
  | { type: "REMOVE_DISCOUNT" } // Action to remove the discount
  | { type: "CLEAR_CART" }; // Action to clear the cart

interface CartContextType extends CartState {
  addItem: (product: Product) => void; // Function to add an item to the cart
  removeItem: (productId: number) => void; // Function to remove an item from the cart
  updateQuantity: (productId: number, quantity: number) => void; // Function to update item quantity
  saveForLater: (productId: number) => void; // Function to save an item for later
  moveToCart: (productId: number) => void; // Function to move an item back to the cart
  applyDiscount: (code: string) => void; // Function to apply a discount code
  removeDiscount: () => void; // Function to remove the discount
  clearCart: () => void; // Function to clear the cart
}

const CartContext = createContext<CartContextType | null>(null);

const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

const initialState: CartState = {
  items: [],
  savedItems: [],
  discountCode: null,
  discountAmount: 0,
  shipping: 0,
  subtotal: 0,
  total: 0,
};

const STORAGE_KEY = "cart-state";

// Load initial state from localStorage
const loadInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;

  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error("Failed to load cart state:", error);
    return initialState;
  }
};

/**
 * Calculates the totals for the cart based on the items.
 *
 * @param items - The items in the cart.
 * @returns An object containing subtotal, shipping, and total amounts.
 */
function calculateTotals(
  items: CartItem[]
): Pick<CartState, "subtotal" | "shipping" | "total"> {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

/**
 * Reducer function to manage cart state.
 *
 * @param state - The current state of the cart.
 * @param action - The action to perform on the cart state.
 * @returns The new state of the cart.
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      const newItems = existingItem
        ? state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...state.items,
            {
              ...action.payload,
              quantity: 1,
              selectedVariant: undefined, // Set default values for required properties
              giftWrap: false,
              estimatedDelivery: calculateEstimatedDelivery(),
              productid: action.payload.id, // Ensure productid is included
            },
          ];

      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "SAVE_FOR_LATER": {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return state;

      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        savedItems: [...state.savedItems, item],
        ...calculateTotals(newItems),
      };
    }

    case "MOVE_TO_CART": {
      const item = state.savedItems.find((item) => item.id === action.payload);
      if (!item) return state;

      const newSavedItems = state.savedItems.filter(
        (item) => item.id !== action.payload
      );
      const newItems = [...state.items, item];
      return {
        ...state,
        items: newItems,
        savedItems: newSavedItems,
        ...calculateTotals(newItems),
      };
    }

    case "APPLY_DISCOUNT": {
      const discountAmount = DISCOUNT_CODES[action.payload] || 0;
      const total =
        state.subtotal + state.shipping - state.subtotal * discountAmount;
      return {
        ...state,
        discountCode: action.payload,
        discountAmount,
        total,
      };
    }

    case "REMOVE_DISCOUNT": {
      return {
        ...state,
        discountCode: null,
        discountAmount: 0,
        total: state.subtotal + state.shipping,
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

/**
 * CartProvider component that provides cart context to its children.
 *
 * @param children - The child components that will have access to the cart context.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);
  const { toast } = useToast();

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save cart state:", error);
    }
  }, [state]);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  }, []);

  const saveForLater = useCallback((productId: number) => {
    dispatch({ type: "SAVE_FOR_LATER", payload: productId });
  }, []);

  const moveToCart = useCallback((productId: number) => {
    dispatch({ type: "MOVE_TO_CART", payload: productId });
  }, []);

  const applyDiscount = useCallback(
    (code: string) => {
      if (!DISCOUNT_CODES[code]) {
        toast({
          variant: "destructive",
          description: "Invalid discount code",
        });
        return;
      }
      dispatch({ type: "APPLY_DISCOUNT", payload: code });
    },
    [toast]
  );

  const removeDiscount = useCallback(() => {
    dispatch({ type: "REMOVE_DISCOUNT" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        saveForLater,
        moveToCart,
        applyDiscount,
        removeDiscount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to use the CartContext.
 *
 * @returns The cart context.
 * @throws Error if used outside of CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
/**
 * Calculates an estimated delivery date.
 *
 * @returns A string representing the estimated delivery date.
 */
function calculateEstimatedDelivery(): string {
  const currentDate = new Date();
  const estimatedDeliveryDate = new Date(currentDate);
  estimatedDeliveryDate.setDate(currentDate.getDate() + 7); // Assuming delivery takes 7 days
  return estimatedDeliveryDate.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
}
