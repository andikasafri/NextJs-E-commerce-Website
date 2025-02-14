import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("State Management Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Cart State", () => {
    it("should add items to cart", () => {
      const { result } = renderHook(() => useCart());

      const mockProduct = {
        id: 1,
        title: "Test Product",
        price: 10,
        description: "Test Description",
        category: { id: 1, name: "Test Category" },
        images: [],
      };

      act(() => {
        result.current.addItem(mockProduct);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(1);
    });

    it("should update quantity correctly", () => {
      const { result } = renderHook(() => useCart());

      const mockProduct = {
        id: 1,
        title: "Test Product",
        price: 10,
        description: "Test Description",
        category: { id: 1, name: "Test Category" },
        images: [],
      };

      act(() => {
        result.current.addItem(mockProduct);
        result.current.updateQuantity(1, 3);
      });

      expect(result.current.items[0].quantity).toBe(3);
    });

    it("should calculate totals correctly", () => {
      const { result } = renderHook(() => useCart());

      const mockProduct = {
        id: 1,
        title: "Test Product",
        price: 10,
        description: "Test Description",
        category: { id: 1, name: "Test Category" },
        images: [],
      };

      act(() => {
        result.current.addItem(mockProduct);
        result.current.updateQuantity(1, 2);
      });

      expect(result.current.subtotal).toBe(20);
      expect(result.current.total).toBe(30); // Including shipping
    });

    it("should persist cart state", () => {
      const { result } = renderHook(() => useCart());

      const mockProduct = {
        id: 1,
        title: "Test Product",
        price: 10,
        description: "Test Description",
        category: { id: 1, name: "Test Category" },
        images: [],
      };

      act(() => {
        result.current.addItem(mockProduct);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("Auth State", () => {
    it("should update user profile", async () => {
      const { result } = renderHook(() => useAuth());

      const mockUpdateProfile = jest.fn().mockResolvedValue({
        name: "Updated Name",
      });

      (useAuth as jest.Mock).mockReturnValue({
        user: { id: 1, name: "Test User" },
        updateProfile: mockUpdateProfile,
      });

      await act(async () => {
        await result.current.updateProfile({ name: "Updated Name" });
      });

      expect(mockUpdateProfile).toHaveBeenCalledWith({ name: "Updated Name" });
    });

    it("should handle login errors", async () => {
      const { result } = renderHook(() => useAuth());

      const mockLogin = jest
        .fn()
        .mockRejectedValue(new Error("Invalid credentials"));

      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
      });

      await act(async () => {
        try {
          await result.current.login("test@example.com", "wrong-password");
        } catch (error) {
          expect(error.message).toBe("Invalid credentials");
        }
      });
    });
  });
});
