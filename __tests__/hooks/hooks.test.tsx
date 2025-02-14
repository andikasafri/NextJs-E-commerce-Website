import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useAuthWishlist } from "@/lib/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock product data
const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  name: "Test Product",
  price: 99.99,
  description: "Test Description",
  category: {
    id: 1,
    name: "Test Category",
  },
  images: ["test-image.jpg"],
};

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it("should initialize with null user and token", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBeFalsy();
  });

  it("should handle successful login", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("admin@gmail.com", "admin1234");
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.isAdmin).toBeTruthy();
  });

  it("should handle logout", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBeFalsy();
  });
});

describe("useCart Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(mockProduct.id);
  });

  it("should update quantity of existing item", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.updateQuantity(mockProduct.id, 2);
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("should calculate correct total", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.updateQuantity(mockProduct.id, 2);
    });

    expect(result.current.total).toBe(mockProduct.price * 2);
  });
});

describe("useAuthWishlist Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty wishlist when not authenticated", () => {
    const { result } = renderHook(() => useAuthWishlist());
    expect(result.current.items).toHaveLength(0);
  });

  it("should handle adding items to wishlist", () => {
    // Mock authenticated user
    jest.spyOn(require("@/lib/auth"), "useAuth").mockImplementation(() => ({
      user: { id: 1, name: "Test User" },
    }));

    const { result } = renderHook(() => useAuthWishlist());

    act(() => {
      result.current.addItem(1);
    });

    expect(result.current.hasItem(1)).toBeTruthy();
  });
});

describe("useToast Hook", () => {
  it("should show toast message", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        description: "Test toast message",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].description).toBe("Test toast message");
  });

  //   it("should handle multiple toasts", () => {
  //     const { result } = renderHook(() => useToast());

  //     act(() => {
  //       result.current.toast({ description: "Toast 1" });
  //       result.current.toast({ description: "Toast 2" });
  //     });

  //     expect(result.current.toasts).toHaveLength(2);
  //   });

  it("should dismiss toast", () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const toast = result.current.toast({ description: "Test toast" });
      toastId = toast.id;
    });

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(
      result.current.toasts.find((t) => t.id === toastId)?.open
    ).toBeFalsy();
  });
});
