import { CDN_URL } from "../utils/constants";

const RestaurantCard = ({
  cloudinaryImageId,
  name = "Unknown Restaurant",
  cuisines = [],
  costForTwo = "N/A",
  avgRating = "N/A",
  sla = {},
  isOpen = true,
}) => (
  <article className="group card-surface w-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <div className="relative h-44 overflow-hidden">
      <img
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        alt={name}
        src={
          cloudinaryImageId
            ? CDN_URL + cloudinaryImageId
            : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
      {!isOpen && (
        <span className="absolute left-3 top-3 rounded-lg bg-red-500/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          Closed
        </span>
      )}
      <span className="badge-rating absolute bottom-3 left-3 shadow-md">
        ★ {avgRating}
      </span>
    </div>

    <div className="p-4">
      <h3 className="font-display text-lg font-bold text-ink-900 line-clamp-1">
        {name}
      </h3>
      <p className="mt-1 text-sm text-ink-500 line-clamp-2">
        {cuisines.length ? cuisines.join(", ") : "Multi-cuisine"}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-sm">
        <span className="flex items-center gap-1 text-ink-600">
          <span aria-hidden>⏱</span>
          {sla?.deliveryTime ? `${sla.deliveryTime} mins` : "—"}
        </span>
        <span className="font-semibold text-ink-800">{costForTwo}</span>
      </div>
    </div>
  </article>
);

export const withPromotedLabel = (WrappedComponent) => (props) => (
  <div className="relative">
    <span className="absolute left-3 top-3 z-10 rounded-lg bg-brand-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
      Promoted
    </span>
    <WrappedComponent {...props} />
  </div>
);

export default RestaurantCard;
