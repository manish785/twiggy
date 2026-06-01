import { calculateTotals } from "../redux/CartPage/reducer";

const CART_STORAGE_KEY = "foodheaven_cart";

export function loadPersistedCart() {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data)) return null;

    const data = parsed.data;
    let itemCount = Number(parsed.itemCount) || 0;
    let totalCartPrice = Number(parsed.totalCartPrice) || 0;

    // Recompute if items exist but totals were missing (e.g. after Auth0 reload)
    if (data.length > 0) {
      const totals = calculateTotals(data);
      itemCount = totals.itemCount;
      totalCartPrice = totals.totalCartPrice;
    }

    return {
      loading: false,
      data,
      itemCount,
      totalCartPrice,
      deliveryAddress: parsed.deliveryAddress || {},
    };
  } catch {
    return null;
  }
}

export function persistCart(cartState) {
  try {
    const data = cartState.data || [];
    const totals =
      data.length > 0
        ? calculateTotals(data)
        : {
            itemCount: cartState.itemCount || 0,
            totalCartPrice: cartState.totalCartPrice || 0,
          };

    sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        data,
        itemCount: totals.itemCount,
        totalCartPrice: totals.totalCartPrice,
        deliveryAddress: cartState.deliveryAddress || {},
      })
    );
  } catch {
    // Ignore quota / private mode errors
  }
}

export function clearPersistedCart() {
  sessionStorage.removeItem(CART_STORAGE_KEY);
}
