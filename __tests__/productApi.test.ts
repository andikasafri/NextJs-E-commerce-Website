describe("API Functionality Tests", () => {
  const apiPath =
    "C:\\Users\\Andy\\Downloads\\BeforeJest\\project\\lib\\productApi";
  const {
    getProducts,
    handleResponse,
    handleApiError,
    getProduct,
    ApiError,
  } = require(apiPath);

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // getProducts successfully fetches and returns array of products with valid offset and limit
  it("should return array of products when called with valid offset and limit", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "desc1",
        category: { id: 1, name: "Cat 1" },
        images: ["img1"],
      },
      {
        id: 2,
        title: "Product 2",
        price: 200,
        description: "desc2",
        category: { id: 1, name: "Cat 1" },
        images: ["img2"],
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    ) as jest.Mock;

    const result = await getProducts(0, 2);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=2"
    );
    expect(result).toEqual(mockProducts);
  });

  // handleResponse throws Error with custom message on non-200 status codes
  it("should throw error with custom message when response is not ok", async () => {
    const errorResponse = {
      ok: false,
      json: () => Promise.resolve({ message: "Custom error message" }),
    };

    await expect(handleResponse(errorResponse as Response)).rejects.toThrow(
      "Custom error message"
    );
  });

  // handleApiError properly propagates ApiError instances without modification
  it("should propagate ApiError instances without modification", async () => {
    const error = new ApiError(404, "Not Found", {
      message: "Product not found",
    });
    await expect(() => handleApiError(error)).rejects.toThrow(error);
  });

  // handleResponse correctly parses JSON response when status is 200
  it("should parse JSON response when status is 200", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    const result = await handleResponse(mockResponse as unknown as Response);
    expect(result).toEqual({ data: "test" });
    expect(mockResponse.json).toHaveBeenCalled();
  });

  // Network timeout/connection errors
  it("should throw an error when network request times out", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Network timeout")), 1000)
        )
    );

    await expect(getProducts(0, 10)).rejects.toThrow("Network timeout");
  });

  // API responses match Product interface structure
  it("should return products matching the Product interface when API call is successful", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: "Product 1",
          price: 100,
          description: "Description 1",
          category: "Category 1",
          images: ["image1.jpg"],
          stock: 10,
          ratings: 4.5,
          reviews: 100,
          variants: [],
        },
      ]),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const products = await getProducts(0, 10);

    expect(products).toEqual([
      {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Description 1",
        category: "Category 1",
        images: ["image1.jpg"],
        stock: 10,
        ratings: 4.5,
        reviews: 100,
        variants: [],
      },
    ]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
    );
  });

  // Revalidation cache control works as expected in getProduct
  it("should set revalidation cache control when fetching a product", async () => {
    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 1,
        title: "Test Product",
        price: 100,
        description: "A test product",
        category: {},
        images: [],
      }),
    } as unknown as Response);

    const productId = 1;
    await getProduct(productId);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.escuelajs.co/api/v1/products/${productId}`,
      { next: { revalidate: 3600 } }
    );

    mockFetch.mockRestore();
  });

  // ApiError properly inherits from Error class with custom fields
  it("should create an ApiError instance with correct properties when instantiated", () => {
    const status = 404;
    const message = "Not Found";
    const data = {
      message: "Product not found",
      details: "The product with the given ID does not exist.",
    };

    const apiError = new ApiError(status, message, data);

    expect(apiError).toBeInstanceOf(Error);
    expect(apiError.name).toBe("ApiError");
    expect(apiError.status).toBe(status);
    expect(apiError.message).toBe(message);
    expect(apiError.data).toEqual(data);
  });
});
