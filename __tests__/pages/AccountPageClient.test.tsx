// __tests__/pages/AccountPageClient.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import AccountPageClient from "@/app/account/AccountPageClient";

// --- Mocks ---
// Mock authentication hook
jest.mock("@/lib/auth");

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock any UI components that might interfere with the tests (for example, toast notifications)
jest.mock("@/components/ui/toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("AccountPageClient Component", () => {
  // Common mock router for navigation-related tests
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Make sure every test using useRouter gets our common router mock.
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  // ======================================================
  // Authentication States
  // ======================================================
  describe("Authentication States", () => {
    it("renders loading state when authentication is in progress", () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: true,
        isAdmin: false,
      });

      render(<AccountPageClient />);
      // Assuming that a status element (e.g., a spinner) is rendered during loading
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("redirects unauthenticated users to /login", async () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        isAdmin: false,
      });

      render(<AccountPageClient />);
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
      });
    });

    it("renders content for authenticated users", () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
      });

      render(<AccountPageClient />);
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("shows admin features for admin users", () => {
      const mockAdminUser = {
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: mockAdminUser,
        isLoading: false,
        isAdmin: true,
      });

      render(<AccountPageClient />);
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });

    it("displays session error messages when available", () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        error: "Session expired",
        isAdmin: false,
      });

      render(<AccountPageClient />);
      expect(screen.getByText("Session expired")).toBeInTheDocument();
    });
  });

  // ======================================================
  // Profile Update Functionality
  // ======================================================
  describe("Profile Update Functionality", () => {
    // Use a default mock user for these tests
    const mockUser = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "user",
    };

    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
        // Provide a default updateProfile method that can be overridden per test
        updateProfile: jest.fn(),
      });
    });

    it("updates the profile when valid input is provided", async () => {
      const mockUpdateProfile = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
        updateProfile: mockUpdateProfile,
      });

      render(<AccountPageClient />);

      // Locate the name input and update its value
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: "Updated Name" } });

      // Submit the profile update form
      const submitButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      fireEvent.click(submitButton);

      // Verify that the updateProfile method was called with the correct new value
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          name: "Updated Name",
        });
      });
    });

    it("displays error messages when the profile update fails", async () => {
      // Simulate a failed update by rejecting the promise from updateProfile
      const mockUpdateProfile = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
        updateProfile: mockUpdateProfile,
      });

      render(<AccountPageClient />);

      const submitButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to update profile")
        ).toBeInTheDocument();
      });
    });
  });

  // ======================================================
  // URL Parameter Handling (Tabs)
  // ======================================================
  describe("URL Parameter Handling", () => {
    it("selects the correct tab based on URL parameters", () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
      });

      // Override the router mock to include URL query parameters
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        query: { tab: "orders" },
      });

      render(<AccountPageClient />);
      // Check that the tab with the label "orders" is selected (aria-selected === "true")
      expect(screen.getByRole("tab", { name: /orders/i })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    it("updates the URL when a different tab is selected", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
        isAdmin: false,
      });

      render(<AccountPageClient />);

      // Simulate clicking on the orders tab
      const ordersTab = screen.getByRole("tab", { name: /orders/i });
      fireEvent.click(ordersTab);

      // Verify that the router push method was called with a URL that contains the "tab=orders" query string
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(
          expect.stringContaining("tab=orders")
        );
      });
    });
  });
});
