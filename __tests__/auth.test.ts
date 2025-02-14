import { useAuth } from "../lib/auth"; // Import the useAuth hook

describe("Auth Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Admin login with correct credentials sets admin user state
  it("should set admin user state when logging in with admin credentials", async () => {
    const { login } = useAuth.getState();
    await login("admin@gmail.com", "admin1234");

    const state = useAuth.getState();
    expect(state.user).toEqual({
      id: 0,
      email: "admin@gmail.com",
      name: "Admin",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      cart: [],
    });
    expect(state.token).toBe("admin-token");
    expect(state.isAdmin).toBe(true);
  });

  // Update profile without authentication throws error
  it("should throw error when updating profile without authentication", async () => {
    const { updateProfile } = useAuth.getState();
    await expect(updateProfile({ name: "New Name" })).rejects.toThrow(
      "Not authenticated"
    );
  });
});
