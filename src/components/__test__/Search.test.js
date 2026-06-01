import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import appStore from "../../utils/appStore";
import { AuthProvider } from "../../context/AuthContext";
import Body from "../Body";

jest.mock("../../utils/useRestaurants", () => () => ({
  restaurants: [
    {
      info: {
        id: "1",
        name: "Test Restaurant",
        avgRating: 4.5,
        costForTwoMessage: "₹300 for two",
        isOpen: true,
        sla: { deliveryTime: 25 },
        cuisines: ["Indian"],
        cloudinaryImageId: "test",
      },
    },
  ],
  isLoading: false,
  error: null,
  refetch: jest.fn(),
}));

const renderBody = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Provider store={appStore}>
          <Body />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );

it("renders restaurant search section", () => {
  renderBody();
  expect(screen.getByText(/Restaurants near you/i)).toBeInTheDocument();
});
