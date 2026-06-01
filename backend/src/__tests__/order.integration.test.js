/**
 * @jest-environment node
 */
const path = require("path");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { cleanupOrders, recreateSchema, TEST_DB_NAME } = require("./helpers/testDb");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-secret";
process.env.DB_NAME = TEST_DB_NAME;
process.env.DEV_AUTH_KEY = process.env.DEV_AUTH_KEY || "integration-dev-key";

const app = require("../app");

function buildAuthHeader() {
  const token = jwt.sign(
    { sub: "test-user-1", email: "test@foodheaven.app", role: "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return `Bearer ${token}`;
}

describe("Order API integration", () => {
  beforeAll(async () => {
    await recreateSchema();
  });

  beforeEach(async () => {
    await cleanupOrders();
  });

  it("creates order and confirms payment", async () => {
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", buildAuthHeader())
      .set("Idempotency-Key", "integration-order-1")
      .send({
        items: [
          {
            menuItemId: 1,
            quantity: 2,
          },
        ],
        paymentMethod: "card",
        deliveryAddress: {
          name: "Manish",
          email: "manish@example.com",
          number: "9999999999",
          address: "Street 123",
          pincode: "110001",
        },
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.orderId).toBeDefined();

    const orderId = createResponse.body.data.orderId;
    const paymentResponse = await request(app)
      .post(`/api/v1/orders/${orderId}/payments`)
      .set("Authorization", buildAuthHeader())
      .send({
        status: "SUCCESS",
        provider: "INTEGRATION_GATEWAY",
      });

    expect(paymentResponse.statusCode).toBe(200);
    expect(paymentResponse.body.success).toBe(true);
    expect(paymentResponse.body.data.orderStatus).toBe("PAID");
  });
});
