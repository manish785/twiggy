import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import appStore from "../../utils/appStore";
import { AuthProvider } from "../../context/AuthContext";
import Header from "../Header";

const renderHeader = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Provider store={appStore}>
          <Header />
        </Provider>
      </AuthProvider>
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
