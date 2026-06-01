import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Shimmer from "./Shimmer";
import { FOOD_PLACEHOLDER, MENU_ITEM_URL } from "../utils/constants";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { addToCart } from "../redux/CartPage/action";

const RestaurantMenu = () => {
  const { resId } = useParams();
  const dispatch = useDispatch();
  const { resInfo, error } = useRestaurantMenu(resId);

  if (error) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="card-surface max-w-md p-8 text-center">
          <p className="text-red-600">{error}</p>
          <Link to="/" className="btn-primary mt-4">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!resInfo) return <Shimmer />;

  const { name, cuisines, costForTwoMessage } = resInfo.info;
  const itemCards = resInfo.itemCards || [];

  const handleAddToCart = (item) => {
    const itemPriceInRupees = Number((item.price || item.defaultPrice || 0) / 100);

    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: itemPriceInRupees,
        productQuantity: 1,
      })
    );
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-4xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-ink-500">
          <Link to="/" className="hover:text-brand-600">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-ink-800">{name}</span>
        </nav>

        <div className="card-surface mb-8 p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            {name}
          </h1>
          <p className="mt-2 text-ink-600">{cuisines?.join(" • ")}</p>
          <p className="mt-1 text-sm font-medium text-brand-600">
            {costForTwoMessage}
          </p>
        </div>

        <h2 className="mb-4 font-display text-xl font-bold text-ink-900">Menu</h2>

        <ul data-testid="menu" className="space-y-4">
          {itemCards.map((item) => {
            const info = item?.card?.info;
            const price = (info.price || info.defaultPrice) / 100;

            return (
              <li
                key={info.id}
                className="card-surface flex flex-col gap-4 p-4 transition hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4">
                  <img
                    className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-ink-100"
                    src={
                      info.imageId ? MENU_ITEM_URL + info.imageId : FOOD_PLACEHOLDER
                    }
                    alt={info.name}
                    onError={(e) => {
                      e.currentTarget.src = FOOD_PLACEHOLDER;
                    }}
                  />
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-900">
                      {info.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-ink-800">₹{price}</p>
                    <span className="badge-rating mt-2">
                      {info?.ratings?.aggregatedRating?.rating || "—"} ★
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="addBtn"
                  className="btn-primary shrink-0 sm:min-w-[140px]"
                  onClick={() => handleAddToCart(info)}
                >
                  + Add to cart
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RestaurantMenu;
