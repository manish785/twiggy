/**
 * Order routes (mounted at /api/v1 in app.js).
 * Protected endpoints — require JWT via authMiddleware before create or pay.
 */
// Express — sub-router for order-related HTTP endpoints
const express = require("express");
// Wraps async controllers so rejected promises reach errorHandler
const asyncHandler = require("../../utils/asyncHandler");
// HTTP layer: maps req/res to orderService calls
const orderController = require("../../controllers/order.controller");
// Verifies Authorization: Bearer <token>; sets req.user (see middlewares/auth.js)
const authMiddleware = require("../../middlewares/auth");
// Joi validation on req.body before controller runs
const { validateBody } = require("../../middlewares/validate");
// Schemas for checkout payload and payment confirmation body
const {
  createOrderSchema,
  confirmPaymentSchema,
} = require("../../validators/order.validator");

// Router instance; full paths are /api/v1 + route path below
const router = express.Router();

// POST /api/v1/orders — create order from cart + delivery address (authenticated)
router.post(
  "/orders",
  authMiddleware,
  validateBody(createOrderSchema),
  asyncHandler(orderController.createOrder)
);
// POST /api/v1/orders/:orderId/payments — mock payment gateway callback / confirm
router.post(
  "/orders/:orderId/payments",
  authMiddleware,
  validateBody(confirmPaymentSchema),
  asyncHandler(orderController.confirmPayment)
);

// Exported router — app.js: app.use("/api/v1", orderRoutes)
module.exports = router;
