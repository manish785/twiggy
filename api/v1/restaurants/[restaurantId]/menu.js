const catalog = require("../../../lib/catalog.json");

module.exports = (req, res) => {
  const restaurantId = req.query.restaurantId;
  const menu = catalog.menus[String(restaurantId)];

  res.setHeader("Content-Type", "application/json");

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  return res.status(200).json({ success: true, data: menu });
};
