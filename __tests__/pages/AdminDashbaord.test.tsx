import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "@/app/admin/dashboard/page";
import { getAdminStats } from "@/lib/admin/api";

jest.mock("@/lib/admin/api", () => ({
  getAdminStats: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: { role: "admin" },
    isAdmin: true,
  }),
}));

describe("Admin Dashboard", () => {
  const mockStats = {
    revenue: {
      total: 10000,
      growth: 15,
      breakdown: [
        { period: "Jan", amount: 1000 },
        { period: "Feb", amount: 1200 },
      ],
    },
    orders: {
      total: 150,
      growth: 10,
    },
    customers: {
      total: 500,
      growth: 20,
    },
    inventory: {
      total: 1000,
      lowStock: 50,
      outOfStock: 10,
    },
  };

  beforeEach(() => {
    (getAdminStats as jest.Mock).mockReset();
  });

  test("renders dashboard with loading state", () => {
    (getAdminStats as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminDashboard />);

    expect(screen.getByTestId("dashboard-skeleton")).toBeInTheDocument();
  });

  test("renders dashboard with stats data", async () => {
    (getAdminStats as jest.Mock).mockResolvedValueOnce(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("$10,000")).toBeInTheDocument();
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
    });
  });

  test("handles error state", async () => {
    (getAdminStats as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load stats/i)).toBeInTheDocument();
    });
  });

  test("renders all dashboard sections", async () => {
    (getAdminStats as jest.Mock).mockResolvedValueOnce(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/revenue breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/customer segments/i)).toBeInTheDocument();
      expect(screen.getByText(/inventory management/i)).toBeInTheDocument();
    });
  });
});
