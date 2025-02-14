import { render, screen, fireEvent } from "@testing-library/react";
import ProductGrid from "@/components/product-grid";
import { useCart } from "@/lib/cart";

jest.mock("@/lib/cart", () => ({
  useCart: jest.fn(),
}));

const mockProducts = [
  {
    id: 1,
    title: "Test Product 1",
    price: 99.99,
    description: "Test description 1",
    category: { id: 1, name: "Category 1" },
    images: ["test1.jpg"],
  },
  {
    id: 2,
    title: "Test Product 2",
    price: 149.99,
    description: "Test description 2",
    category: { id: 1, name: "Category 1" },
    images: ["test2.jpg"],
  },
];

describe("ProductGrid Component", () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addItem: mockAddToCart,
    });
  });

  test("renders product grid with correct number of items", () => {
    render(<ProductGrid products={mockProducts} />);

    expect(screen.getAllByRole("article")).toHaveLength(mockProducts.length);
  });

  test("displays product information correctly", () => {
    render(<ProductGrid products={mockProducts} />);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Test description 1")).toBeInTheDocument();
  });

  test("handles add to cart action", () => {
    render(<ProductGrid products={mockProducts} />);

    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  test("renders empty state when no products", () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
