import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import ProductDetails from "@/app/product/[id]/product-details";

// Component test with JSX - needs .tsx
jest.mock("next/navigation");
jest.mock("@/lib/cart");

describe("ProductDetails Component", () => {
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
    (useCart as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
      items: [],
    });
  });

  it("should render product details", () => {
    render(<ProductDetails product={mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it("should handle add to cart", () => {
    const mockAddToCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      addItem: mockAddToCart,
      items: [],
    });

    render(<ProductDetails product={mockProduct} />);
    fireEvent.click(screen.getByText(/Add to Cart/i));

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
