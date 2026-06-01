import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = location?.state?.orderNumber;
  const totalAmount = location?.state?.totalAmount;

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page-shell flex items-center justify-center py-16">
      <div className="card-surface max-w-md p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">
          Order placed!
        </h1>
        <p className="mt-2 text-ink-500">
          Your food is on the way. Thanks for ordering with FoodHeaven.
        </p>

        {orderNumber && (
          <p className="mt-6 rounded-xl bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700">
            Order ID: <span className="text-brand-600">{orderNumber}</span>
          </p>
        )}
        {totalAmount && (
          <p className="mt-2 text-lg font-bold text-ink-900">
            Paid ₹{totalAmount}
          </p>
        )}

        <p className="mt-6 text-xs text-ink-400">Redirecting to home in a few seconds...</p>

        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default PaymentConfirm;
