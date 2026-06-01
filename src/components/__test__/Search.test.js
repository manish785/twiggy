import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import Body from "../Body";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            info: {
              id: "1",
              name: "Test Restaurant",
              cuisines: ["Indian"],
              avgRating: 4.5,
              costForTwo: "₹300",
              isOpen: true,
              sla: { deliveryTime: 25 },
            },
          },
        ],
      },
    })
  ),
}));

const renderBody = () =>
  render(
    <BrowserRouter>
      <Body />
    </BrowserRouter>
  );

it("renders home page with search input", async () => {
  renderBody();

  await waitFor(() => {
    expect(
      screen.getByPlaceholderText("Search for restaurants, cuisines...")
    ).toBeInTheDocument();
  });
});
