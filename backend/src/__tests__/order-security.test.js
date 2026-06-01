/**
 * @jest-environment node
 */
const authMiddleware = require("../middlewares/auth");
const { createOrderSchema } = require("../validators/order.validator");

describe("Order security and validation", () => {
  it("rejects missing bearer auth header", async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret";
    delete process.env.AUTH0_DOMAIN;
    delete process.env.AUTH0_AUDIENCE;

    const req = { headers: {} };
    const res = {
      statusCode: 0,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts valid order payload schema", () => {
    const payload = {
      items: [{ menuItemId: 1, quantity: 2 }],
      paymentMethod: "card",
      deliveryAddress: {
        name: "Manish",
        email: "manish@example.com",
        number: "9999999999",
        address: "Test street 12",
        pincode: "110001",
      },
    };

    const { error } = createOrderSchema.validate(payload);
    expect(error).toBeUndefined();
  });

  it("rejects invalid order payload schema", () => {
    const payload = {
      items: [],
      deliveryAddress: {},
    };

    const { error } = createOrderSchema.validate(payload, { abortEarly: false });
    expect(error).toBeDefined();
    expect(error.details.length).toBeGreaterThan(0);
  });
});
