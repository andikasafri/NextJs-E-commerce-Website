import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountPage from "@/app/account/page";
import { useAuth } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
  useAuth: jest.fn(),
}));

describe("Account Page", () => {
  const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    avatar: "test-avatar.jpg",
  };

  const mockUpdateProfile = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      updateProfile: mockUpdateProfile,
    });
  });

  test("renders account page with user information", () => {
    render(<AccountPage />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  test("handles profile update successfully", async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);

    render(<AccountPage />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update profile/i }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: "Updated Name",
      });
      expect(
        screen.getByText(/profile updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error on profile update failure", async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error("Update failed"));

    render(<AccountPage />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update profile/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });

  test("switches between account tabs", () => {
    render(<AccountPage />);

    fireEvent.click(screen.getByRole("tab", { name: /orders/i }));
    expect(screen.getByText(/order history/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /preferences/i }));
    expect(screen.getByText(/notification preferences/i)).toBeInTheDocument();
  });
});
