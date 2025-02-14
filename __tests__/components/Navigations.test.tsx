import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "@/lib/auth";
import { ClientLayout } from "@/components/client-layout";

// Mock the auth hook
jest.mock("@/lib/auth", () => ({
  useAuth: jest.fn(),
}));

describe("Navigation Component", () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  test("renders navigation for unauthenticated users", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAdmin: false,
    });

    render(<ClientLayout>Test Content</ClientLayout>);

    expect(screen.getByText("AndikaShop")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test("renders navigation for authenticated users", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "Test User", email: "test@example.com" },
      isAdmin: false,
      logout: jest.fn(),
    });

    render(<ClientLayout>Test Content</ClientLayout>);

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("renders admin navigation for admin users", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "Admin", email: "admin@example.com" },
      isAdmin: true,
      logout: jest.fn(),
    });

    render(<ClientLayout>Test Content</ClientLayout>);

    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
  });

  test("handles logout correctly", () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { name: "Test User", email: "test@example.com" },
      isAdmin: false,
      logout: mockLogout,
    });

    render(<ClientLayout>Test Content</ClientLayout>);

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
