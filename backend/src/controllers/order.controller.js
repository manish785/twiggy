/**
 * Order controller — thin HTTP adapter between Express and order.service.
 * Parses request input, calls service, shapes JSON responses. No DB or business rules here.
 */
// Business logic, transactions, pricing — lives in the service layer
const orderService = require("../services/order.service");

// POST /api/v1/orders — merge body with Idempotency-Key header, delegate to service
async function createOrder(req, res) {
  const order = await orderService.createOrder({
    ...req.body,
    idempotencyKey: req.headers["idempotency-key"],
  });

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
}

// POST /api/v1/orders/:orderId/payments — validate route param, then confirm payment
async function confirmPayment(req, res) {
  const orderId = Number(req.params.orderId);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      success: false,
      message: "orderId must be a valid positive number",
    });
  }

  const paymentResult = await orderService.confirmOrderPayment(orderId, req.body);

  return res.status(200).json({
    success: true,
    message: "Payment status updated",
    data: paymentResult,
  });
}

module.exports = {
  createOrder,
  confirmPayment,
};
