import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import RestaurantCard from "../RestaurantCard";
import MOCK_DATA from "../mocks/resCardMock.json";

it("renders restaurant card details", () => {
  render(<RestaurantCard {...MOCK_DATA} />);

  expect(
    screen.getByText("Leon's - Burgers & Wings (Leon Grill)")
  ).toBeInTheDocument();
});
