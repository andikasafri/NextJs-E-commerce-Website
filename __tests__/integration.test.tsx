import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import ProductDetails from "@/app/product/[id]/product-details";

// Mock next/navigation and hooks
jest.mock("next/navigation");
jest.mock("@/lib/auth");
jest.mock("@/lib/cart");

describe("Integration Tests", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 10,
    description: "Test Description",
    category: { id: 1, name: "Test Category" },
    images: ["test.jpg"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Test User" },
    });
    (useCart as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
      items: [],
    });
  });

  it("should add to cart and navigate to cart page", async () => {
    const mockAddToCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      addItem: mockAddToCart,
      items: [],
    });

    render(<ProductDetails product={mockProduct} />);

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockRouter.push).toHaveBeenCalledWith("/cart");
  });

  it("should handle state changes during navigation", async () => {
    const mockAddToCart = jest.fn();
    let cartItems: any[] = [];

    (useCart as jest.Mock).mockImplementation(() => ({
      addItem: (...args) => {
        mockAddToCart(...args);
        cartItems = [...cartItems, args[0]];
      },
      items: cartItems,
    }));

    render(<ProductDetails product={mockProduct} />);

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(cartItems).toHaveLength(1);
      expect(mockRouter.push).toHaveBeenCalledWith("/cart");
    });
  });

  it("should preserve state after navigation", async () => {
    const mockAddToCart = jest.fn();
    const cartItems = [mockProduct];

    (useCart as jest.Mock).mockReturnValue({
      addItem: mockAddToCart,
      items: cartItems,
    });

    render(<ProductDetails product={mockProduct} />);

    // Simulate navigation
    mockRouter.push("/cart");

    // Render again to simulate returning to the page
    render(<ProductDetails product={mockProduct} />);

    await waitFor(() => {
      expect(screen.getByText("In Cart")).toBeInTheDocument();
    });
  });

  it("should handle loading states during navigation", async () => {
    mockRouter.push.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ProductDetails product={mockProduct} />);

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });
});
