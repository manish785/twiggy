import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { clearCart } from "../redux/CartPage/action";

const Cart = () => {
  const { data: cartItems, totalCartPrice, itemCount } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  return (
    <div className="page-shell">
      <div className="page-container w-full max-w-2xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="section-title">Your cart</h1>
            <p className="section-subtitle">
              {itemCount > 0
                ? `${itemCount} item${itemCount > 1 ? "s" : ""} ready to order`
                : "Nothing here yet"}
            </p>
          </div>
          {itemCount > 0 && (
            <button
              type="button"
              className="btn-secondary text-red-600 hover:border-red-200 hover:bg-red-50"
              onClick={() => dispatch(clearCart())}
            >
              Clear cart
            </button>
          )}
        </div>

        {itemCount === 0 ? (
          <div className="card-surface flex flex-col items-center py-16 text-center">
            <p className="text-6xl">🛒</p>
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">
              Your cart is empty
            </h2>
            <p className="mt-2 max-w-sm text-ink-500">
              Explore restaurants and add your favourite dishes.
            </p>
            <Link to="/" className="btn-primary mt-8">
              Browse restaurants
            </Link>
          </div>
        ) : (
          <div className="card-surface overflow-hidden">
            <ul className="divide-y divide-ink-100">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-ink-900">{item.name}</p>
                    <p className="text-sm text-ink-500">
                      ₹{item.price} × {item.productQuantity}
                    </p>
                  </div>
                  <p className="font-bold text-ink-900">
                    ₹{item.price * item.productQuantity}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-100 bg-ink-50 px-6 py-5">
              <div className="flex justify-between text-lg font-bold text-ink-900">
                <span>Total</span>
                <span className="text-brand-600">₹{totalCartPrice}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-5 w-full">
                Proceed to checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
