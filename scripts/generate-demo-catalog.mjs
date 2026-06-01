/**
 * Builds api/lib/catalog.json from seed data shape (run: node scripts/generate-demo-catalog.mjs)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const rows = [
  [55474, "Pizza Hut", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Mandawali", "IP Extension", 3.8, "?350 for two", 34, ["Pizzas"]],
  [10101, "Burger Barn", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "City Center", "Main Market", 4.3, "?250 for two", 25, ["Burgers", "Fast Food"]],
  [20202, "Green Bowl", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "Lake View", "Sector 9", 4.6, "?300 for two", 22, ["Healthy Food", "Salads"]],
  [30001, "Spice Route", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Nehru Nagar", "Sector 1", 4.2, "?280 for two", 28, ["North Indian", "Biryani"]],
  [30002, "Roll Nation", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Gandhi Chowk", "Sector 2", 4.1, "?220 for two", 24, ["Rolls", "Snacks"]],
  [30003, "South Spice", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "Old City", "Sector 3", 4.4, "?260 for two", 26, ["South Indian"]],
  [30004, "Taco Street", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Park Avenue", "Sector 4", 4.0, "?300 for two", 29, ["Mexican", "Fast Food"]],
  [30005, "Kebab House", "2b4f62d606d1b2bfba9ba9e5386fabb7", "River Side", "Sector 5", 4.5, "?360 for two", 30, ["Mughlai", "Kebabs"]],
  [30006, "Noodle Bar", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "Tech Park", "Sector 6", 4.3, "?270 for two", 23, ["Chinese", "Asian"]],
  [30007, "Chai & Chat", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Station Road", "Sector 7", 4.0, "?180 for two", 18, ["Street Food", "Beverages"]],
  [30008, "The Salad Lab", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Green Avenue", "Sector 8", 4.7, "?320 for two", 21, ["Healthy Food", "Salads"]],
  [30009, "Wrap It Up", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "City Mall", "Sector 9", 4.1, "?210 for two", 20, ["Wraps", "Fast Food"]],
  [30010, "Dosa Point", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Temple Road", "Sector 10", 4.5, "?240 for two", 19, ["South Indian"]],
  [30011, "Biryani Blues", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Central Plaza", "Sector 11", 4.4, "?340 for two", 31, ["Biryani", "North Indian"]],
  [30012, "Momo Junction", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "Hill View", "Sector 12", 4.0, "?200 for two", 22, ["Tibetan", "Chinese"]],
  [30013, "Pasta Palace", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Rose Garden", "Sector 13", 4.3, "?330 for two", 27, ["Italian", "Pasta"]],
  [30014, "Sushi Bay", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Lake Side", "Sector 14", 4.6, "?480 for two", 33, ["Japanese", "Asian"]],
  [30015, "BBQ Nation Mini", "rng/md/carousel/production/3967580c0329555334072b18ba3c889c", "Metro Plaza", "Sector 15", 4.2, "?420 for two", 35, ["Barbecue", "Grill"]],
  [30016, "Cake Corner", "rng/md/carousel/production/fd426b942f60921eb65afb229d274574", "Bakery Lane", "Sector 16", 4.1, "?190 for two", 17, ["Desserts", "Bakery"]],
  [30017, "Falafel Factory", "2b4f62d606d1b2bfba9ba9e5386fabb7", "Food Street", "Sector 17", 4.3, "?280 for two", 24, ["Middle Eastern", "Healthy Food"]],
];

const menuRows = [
  [55474, "Margherita Pizza", "abc123", 19900, 4.2],
  [55474, "Farmhouse Pizza", "def456", 34900, 4.4],
  [10101, "Classic Cheeseburger", "ghi789", 17900, 4.1],
  [10101, "Peri Peri Fries", "jkl012", 9900, 3.9],
  [20202, "Protein Bowl", "mno345", 25900, 4.7],
  [20202, "Quinoa Salad", "pqr678", 22900, 4.5],
  [30001, "Chicken Dum Biryani", "img30001", 27900, 4.3],
  [30002, "Paneer Kathi Roll", "img30002", 14900, 4.0],
  [30003, "Masala Dosa", "img30003", 12900, 4.5],
  [30004, "Veg Taco Combo", "img30004", 19900, 3.9],
  [30005, "Seekh Kebab Plate", "img30005", 29900, 4.4],
  [30006, "Hakka Noodles", "img30006", 18900, 4.2],
  [30007, "Samosa Chaat", "img30007", 9900, 3.8],
  [30008, "Mediterranean Salad", "img30008", 21900, 4.7],
  [30009, "Chicken Wrap", "img30009", 15900, 4.1],
  [30010, "Mysore Dosa", "img30010", 13900, 4.6],
  [30011, "Hyderabadi Biryani", "img30011", 26900, 4.5],
  [30012, "Steam Momos", "img30012", 12900, 4.0],
  [30013, "Arrabiata Pasta", "img30013", 23900, 4.2],
  [30014, "California Sushi Roll", "img30014", 32900, 4.6],
  [30015, "BBQ Chicken Platter", "img30015", 34900, 4.3],
  [30016, "Chocolate Truffle Cake", "img30016", 14900, 4.1],
  [30017, "Falafel Pita Pocket", "img30017", 19900, 4.4],
];

function toRestaurantCard([
  id,
  name,
  cloudinaryImageId,
  locality,
  areaName,
  avgRating,
  costForTwoMessage,
  deliveryTimeMinutes,
  cuisines,
]) {
  return {
    info: {
      id: String(id),
      name,
      cloudinaryImageId,
      locality,
      areaName,
      avgRating,
      costForTwoMessage,
      isOpen: true,
      veg: false,
      sla: { deliveryTime: deliveryTimeMinutes },
      cuisines,
    },
  };
}

function toMenuItemCard(id, name, imageId, pricePaise, rating) {
  const price = Math.round(pricePaise / 100);
  return {
    card: {
      info: {
        id: String(id),
        name,
        imageId,
        price,
        defaultPrice: price,
        ratings: {
          aggregatedRating: { rating: String(rating) },
        },
      },
    },
  };
}

const restaurants = rows.map(toRestaurantCard);
const menus = {};

for (const row of rows) {
  const id = String(row[0]);
  const info = toRestaurantCard(row).info;
  const items = menuRows
    .filter((m) => m[0] === row[0])
    .map((m, index) =>
      toMenuItemCard(`${row[0]}-${index + 1}`, m[1], m[2], m[3], m[4])
    );
  menus[id] = { info, itemCards: items };
}

const catalog = { restaurants, menus };
const outDir = join(root, "api", "lib");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "catalog.json"), JSON.stringify(catalog, null, 2));
console.log(`Wrote ${restaurants.length} restaurants to api/lib/catalog.json`);
