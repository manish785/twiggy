const catalog = require("./catalog.json");

function buildMenuPriceMap() {
  const map = new Map();

  for (const menu of Object.values(catalog.menus)) {
    for (const entry of menu.itemCards || []) {
      const info = entry?.card?.info;
      if (info?.id) {
        map.set(String(info.id), Number(info.price || info.defaultPrice || 0));
      }
    }
  }

  return map;
}

const menuPriceMap = buildMenuPriceMap();

function calculateOrderTotal(items) {
  let subtotal = 0;

  for (const item of items) {
    const id = String(item.menuItemId);
    const price = menuPriceMap.get(id);

    if (price === undefined) {
      return null;
    }

    subtotal += price * Math.max(1, Number(item.quantity || 1));
  }

  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const totalAmount = Number((subtotal + taxAmount + deliveryFee).toFixed(2));

  return { subtotal, taxAmount, deliveryFee, totalAmount };
}

module.exports = {
  calculateOrderTotal,
};
