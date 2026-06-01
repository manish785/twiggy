import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";
import useOnlineStatus from "../utils/useOnlineStatus";
import useRestaurants from "../utils/useRestaurants";

const FILTERS = [
  { id: "all", label: "All", action: null },
  { id: "open", label: "Open now", action: "open" },
  { id: "rated", label: "Top rated", action: "rated" },
  { id: "veg", label: "Pure veg", action: "veg" },
  { id: "fast", label: "Under 30 min", action: "fast" },
];

const Body = () => {
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { restaurants, error, isLoading, refetch } = useRestaurants();
  const { user, isAuthenticated } = useAuth0();
  const onlineStatus = useOnlineStatus();

  const displayName = isAuthenticated
    ? user?.given_name || user?.name?.split(" ")[0] || "Foodie"
    : "Guest";

  useEffect(() => {
    setFilteredRestaurants(restaurants);
  }, [restaurants]);

  const applyFilter = (filterId) => {
    setActiveFilter(filterId);
    const list = restaurants;

    switch (filterId) {
      case "open":
        setFilteredRestaurants(list.filter((r) => r?.info?.isOpen));
        break;
      case "rated":
        setFilteredRestaurants(list.filter((r) => r?.info?.avgRating > 4));
        break;
      case "veg":
        setFilteredRestaurants(list.filter((r) => r?.info?.veg));
        break;
      case "fast":
        setFilteredRestaurants(
          list.filter((r) => r?.info?.sla?.deliveryTime < 30)
        );
        break;
      default:
        setFilteredRestaurants(list);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      applyFilter(activeFilter);
      return;
    }
    setFilteredRestaurants(
      restaurants.filter((res) =>
        res?.info?.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  if (!onlineStatus) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="card-surface max-w-md p-8 text-center">
          <p className="text-4xl">📡</p>
          <h2 className="mt-4 font-display text-xl font-bold text-ink-900">
            You&apos;re offline
          </h2>
          <p className="mt-2 text-ink-500">Check your connection and try again.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="card-surface max-w-md p-8 text-center">
          <p className="text-4xl">⚠️</p>
          <h2 className="mt-4 font-display text-xl font-bold text-ink-900">
            Couldn&apos;t load restaurants
          </h2>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="btn-primary mt-6"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) return <Shimmer />;

  return (
    <div className="page-shell">
      <section className="bg-hero-gradient border-b border-ink-100">
        <div className="page-container py-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Order food online
          </p>
          <h1 className="section-title mt-2">
            Hey {displayName}, what&apos;s on your mind?
          </h1>
          <p className="section-subtitle max-w-xl">
            Discover top restaurants near you — fresh meals delivered to your door.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-xl">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                🔍
              </span>
              <input
                type="text"
                className="input-field !pl-11"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for restaurants, cuisines..."
              />
            </div>
            <button type="button" className="btn-primary shrink-0" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={
                  activeFilter === f.id ? "filter-chip filter-chip-active" : "filter-chip"
                }
                onClick={() => applyFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Restaurants near you
            </h2>
            <p className="text-sm text-ink-500">
              {filteredRestaurants.length} places to order from
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="card-surface flex flex-col items-center py-16 text-center">
            <p className="text-5xl">🍽️</p>
            <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
              No restaurants found
            </h3>
            <p className="mt-2 text-ink-500">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map((res) => (
              <Link
                key={res?.info?.id}
                to={`/restaurants/${res?.info?.id}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-2xl"
              >
                <RestaurantCard {...res?.info} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Body;
