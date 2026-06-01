import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Address } from "../redux/CartPage/action";
import appStore from "../utils/appStore";
import { persistCart } from "../utils/cartStorage";

const Checkout = () => {
  const name = useRef(null);
  const email = useRef(null);
  const number = useRef(null);
  const address = useRef(null);
  const pincode = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const addressData = {
      name: name.current.value.trim(),
      email: email.current.value.trim(),
      number: number.current.value.trim(),
      address: address.current.value.trim(),
      pincode: pincode.current.value.trim(),
    };

    if (
      !addressData.name ||
      !addressData.email ||
      !addressData.number ||
      !addressData.address ||
      !addressData.pincode
    ) {
      toast.error("Please fill all delivery fields");
      return;
    }

    dispatch(Address(addressData));
    persistCart(appStore.getState().cart);
    toast.success("Address saved");
    navigate("/payment");
  };

  return (
    <div className="page-shell bg-dark-gradient min-h-screen">
      <div className="page-container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <Link
            to="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white"
          >
            ← Back to cart
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="card-surface !border-ink-800/50 !bg-ink-900/90 p-8 text-white backdrop-blur-xl sm:p-10"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              Step 2 of 3
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold">Delivery address</h1>
            <p className="mt-2 text-ink-400">
              Where should we deliver your order?
            </p>

            <div className="mt-8 space-y-4">
              <input
                ref={name}
                type="text"
                placeholder="Full name"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white placeholder:text-ink-500"
              />
              <input
                ref={email}
                type="email"
                placeholder="Email address"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white placeholder:text-ink-500"
              />
              <input
                ref={number}
                type="tel"
                placeholder="Phone number"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white placeholder:text-ink-500"
              />
              <input
                ref={address}
                type="text"
                placeholder="Street address"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white placeholder:text-ink-500"
              />
              <input
                ref={pincode}
                type="text"
                placeholder="Pincode"
                className="input-field !border-ink-700 !bg-ink-800/50 !text-white placeholder:text-ink-500"
              />
            </div>

            <button type="submit" className="btn-primary mt-8 w-full">
              Continue to payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
