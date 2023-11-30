import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/test-utils";

import Card from "../Card";
import { handlers } from "./handlers";
import { setupServer } from "msw/node";

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// иначе на тестах падает график при рендере из-за того что не понимает размер "экрана"
jest.mock("recharts", () => {
  const OriginalRechartsModule = jest.requireActual("recharts");

  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ height, children }) => (
      <div
        className="recharts-responsive-container"
        style={{ width: 800, height }}
      >
        {children}
      </div>
    ),
  };
});
test("fetches & receives a product", async () => {
  renderWithProviders(<Card />);

  // ожидание загрузки продукта
  expect(screen.getByText(/Fetching product\.\.\./i)).toBeInTheDocument();

  // продукт загрузился, произошел перерендер
  expect(await screen.findByText(/RU000A1059R0/i)).toBeInTheDocument();
});
