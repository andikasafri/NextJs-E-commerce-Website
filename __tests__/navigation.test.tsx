import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AccountPageClient from "@/app/account/AccountPageClient";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock auth context
jest.mock("@/lib/auth", () => ({
  useAuth: jest.fn(),
}));

describe("Navigation Tests", () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
      updateProfile: jest.fn(),
    });
  });

  it("should navigate to login page when user logs out", async () => {
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      updateProfile: jest.fn(),
    });

    render(<AccountPageClient />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("should navigate to correct tab when clicking tab triggers", async () => {
    render(<AccountPageClient />);

    const ordersTab = screen.getByText("Orders");
    fireEvent.click(ordersTab);

    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  it("should handle navigation errors gracefully", async () => {
    mockRouter.push.mockRejectedValueOnce(new Error("Navigation failed"));

    render(<AccountPageClient />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to navigate")).toBeInTheDocument();
    });
  });
});
