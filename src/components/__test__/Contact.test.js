import { render, screen } from "@testing-library/react";
import Contact from "../Contact";
import "@testing-library/jest-dom";

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("Contact page", () => {
  it("renders contact headings", () => {
    render(<Contact />);
    expect(screen.getByText("Contact us")).toBeInTheDocument();
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
  });

  it("renders name input", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
  });

  it("renders message textarea", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText("Your message")).toBeInTheDocument();
  });
});
