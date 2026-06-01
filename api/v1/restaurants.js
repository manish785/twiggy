const catalog = require("../lib/catalog.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ success: true, data: catalog.restaurants });
};
