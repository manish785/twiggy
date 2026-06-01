import { useState } from "react";
import { GROCERY_URL } from "../utils/constants";

const groceryItems = [
  {
    id: 1,
    name: "Fresh Apples",
    price: 120,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80",
  },
  {
    id: 2,
    name: "Organic Milk",
    price: 60,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: 40,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80",
  },
  {
    id: 4,
    name: "Tomatoes",
    price: 30,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80",
  },
];

const Grocery = () => {
  const [search, setSearch] = useState("");

  const filteredItems = groceryItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell">
      <div className="relative h-56 overflow-hidden sm:h-72">
        <img
          className="h-full w-full object-cover"
          src={GROCERY_URL}
          alt="Grocery banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 to-ink-900/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Grocery & essentials
            </h1>
            <p className="mt-2 max-w-md text-ink-200">
              Fresh produce and daily essentials delivered to your door.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="mx-auto mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search grocery items..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="card-surface group overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-ink-700 backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ink-900">{item.name}</h3>
                <p className="mt-1 text-lg font-bold text-brand-600">₹{item.price}</p>
                <button type="button" className="btn-secondary mt-4 w-full !py-2 text-sm">
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grocery;
