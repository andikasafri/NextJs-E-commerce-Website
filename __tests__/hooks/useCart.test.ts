import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/lib/cart";

// Pure TypeScript test for hooks - no JSX needed
describe("useCart Hook", () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
    jest.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(0);
  });

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

  it("should persist state to localStorage", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        id: 1,
        title: "Test Product",
        price: 10,
        description: "Test",
        category: { id: 1, name: "Test" },
        images: [],
      });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });
});
