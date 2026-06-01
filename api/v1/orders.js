const { verifyBearerToken } = require("../lib/jwt");
const { calculateOrderTotal } = require("../lib/catalogPrices");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const user = verifyBearerToken(req.headers.authorization);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const deliveryAddress = body.deliveryAddress || {};

  if (!items.length) {
    return res.status(400).json({
      success: false,
      message: "Order must contain at least one item",
    });
  }

  if (
    !deliveryAddress.name ||
    !deliveryAddress.email ||
    !deliveryAddress.number ||
    !deliveryAddress.address ||
    !deliveryAddress.pincode
  ) {
    return res.status(400).json({
      success: false,
      message: "Delivery address is incomplete",
    });
  }

  const totals = calculateOrderTotal(items);

  if (!totals) {
    return res.status(400).json({
      success: false,
      message: "Some menu items are invalid or unavailable",
    });
  }

  const orderId = Date.now();
  const orderNumber = `TWG-${orderId}`;

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: {
      orderId,
      orderNumber,
      totalAmount: totals.totalAmount,
      subtotalAmount: totals.subtotal,
      taxAmount: totals.taxAmount,
      deliveryFee: totals.deliveryFee,
      status: "PENDING",
    },
  });
};
