import { render, screen, waitFor } from "@testing-library/react";
import RestaurantCard from "../RestaurantCard";
import MOCK_DATA from "../mocks/resCardMock.json";
import "@testing-library/jest-dom";

it("should render RestaurantCard component with props Data", async () => {
  render(<RestaurantCard resData={MOCK_DATA} />);

  // Use waitFor with a custom condition
  await waitFor(() => {
    const name = screen.getByText("Leon's - Burgers & Wings (Leon Grill)");
    if (name) {
      return name;
    }
    throw new Error("Element not found");
  });

  // Print the component structure for debugging
  screen.debug();

  // Assert that the element is present in the document
  const name = screen.getByText("Leon's - Burgers & Wings (Leon Grill)");
  expect(name).toBeInTheDocument();
});


it("should render RestaurantCard component with Promoted Label", () => {
    // Home Work - test HOC : withPromtedLabel()
});