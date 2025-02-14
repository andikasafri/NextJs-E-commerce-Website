// File: cart.test.ts

describe("Cart Functionality Tests", () => {
  const cartPath = "C:\\Users\\Andy\\Downloads\\BeforeJest\\project\\lib\\cart";
  const { useCart } = require(cartPath);

  beforeEach(() => {
    // Reset the cart state before each test
    useCart.setState({ items: [] });
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Adding new item to cart updates quantity if item exists, else adds new item
  it("should increment quantity when adding existing item", () => {
    const testProduct = {
      id: 0,
      title: "Test Product",
      price: 10,
      description: "Test Description",
      category: "test",
      images: [],
    };
    const testVariant = {
      id: 0,
      size: "M",
      color: "Blue",
      stock: 10,
    };

    const cart = useCart.getState();
    cart.addItem(testProduct, testVariant);
    cart.addItem(testProduct, testVariant);

    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  // Adding item with zero or negative quantity
  it("should not add item with zero or negative quantity", () => {
    const testProduct = {
      id: 0,
      title: "Test Product",
      price: 10,
      description: "Test Description",
      category: "test",
      images: [],
    };

    const cart = useCart.getState();
    cart.updateQuantity(testProduct.id, 0);

    const items = useCart.getState().items;
    expect(items).toHaveLength(0);
  });

  // Test for adding a non-existent item
  it("should not update quantity for non-existent item", () => {
    const cart = useCart.getState();
    cart.updateQuantity(999, 1); // Attempting to update a non-existent item

    const items = useCart.getState().items;
    expect(items).toHaveLength(0); // No items should be in the cart
  });
});
