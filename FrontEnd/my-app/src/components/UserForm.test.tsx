import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import UserForm from "./UserForm";

describe("UserForm", () => {
  const defaultProps = {
    users: [],
    onAddUser: vi.fn().mockResolvedValue(undefined),
    onEditUser: vi.fn().mockResolvedValue(undefined),
    userToEdit: null,
    onCancelEdit: vi.fn(),
  };

  it("renders the Add User form", () => {
    render(<UserForm {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Add User" }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();

    expect(screen.getByLabelText("Address")).toBeInTheDocument();
  });

  it("shows a validation message when the name is empty", async () => {
    render(<UserForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });

    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "Hyderabad" },
    });

    fireEvent.click(screen.getByRole("radio", { name: "Male" }));

    fireEvent.submit(
      screen.getByRole("heading", { name: "Add User" }).closest("form")!,
    );

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(defaultProps.onAddUser).not.toHaveBeenCalled();
  });

  it("rejects a phone number with fewer than 10 digits", async () => {
    render(<UserForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "12345" },
    });

    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "Hyderabad" },
    });

    fireEvent.click(screen.getByRole("radio", { name: "Male" }));

    fireEvent.submit(
      screen.getByRole("heading", { name: "Add User" }).closest("form")!,
    );

    expect(
      await screen.findByText("Phone number must contain exactly 10 digits"),
    ).toBeInTheDocument();

    expect(defaultProps.onAddUser).not.toHaveBeenCalled();
  });

  it("submits valid user details", async () => {
    render(<UserForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });

    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "Hyderabad" },
    });

    fireEvent.click(screen.getByRole("radio", { name: "Male" }));

    fireEvent.submit(
      screen.getByRole("heading", { name: "Add User" }).closest("form")!,
    );

    await waitFor(() => {
      expect(defaultProps.onAddUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          gender: "Male",
          address: "Hyderabad",
        }),
        null,
      );
    });
  });
});
