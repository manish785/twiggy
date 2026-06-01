const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const orderController = require("../../controllers/order.controller");
const authMiddleware = require("../../middlewares/auth");
const { validateBody } = require("../../middlewares/validate");
const {
  createOrderSchema,
  confirmPaymentSchema,
} = require("../../validators/order.validator");

const router = express.Router();

router.post(
  "/orders",
  authMiddleware,
  validateBody(createOrderSchema),
  asyncHandler(orderController.createOrder)
);
router.post(
  "/orders/:orderId/payments",
  authMiddleware,
  validateBody(confirmPaymentSchema),
  asyncHandler(orderController.confirmPayment)
);

module.exports = router;
