const { verifyBearerToken } = require("../../../lib/jwt");

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

  const orderId = Number(req.query.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      success: false,
      message: "orderId must be a valid positive number",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Payment status updated",
    data: {
      orderId,
      orderNumber: `TWG-${orderId}`,
      totalAmount: 0,
      status: "CONFIRMED",
      paymentStatus: "SUCCESS",
    },
  });
};
