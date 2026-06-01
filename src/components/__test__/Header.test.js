import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import appStore from "../../utils/appStore";
import Header from "../Header";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }),
}));

const renderHeader = () =>
  render(
    <BrowserRouter>
      <Provider store={appStore}>
        <Header />
      </Provider>
    </BrowserRouter>
  );

it("renders login button", () => {
  renderHeader();
  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
});

it("renders cart link", () => {
  renderHeader();
  expect(screen.getByRole("link", { name: /Cart/i })).toBeInTheDocument();
});
