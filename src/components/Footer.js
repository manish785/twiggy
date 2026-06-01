import { Link } from "react-router-dom";

import BrandLogo from "./BrandLogo";

const SITEMAP = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Order",
    links: [
      { name: "Restaurants", href: "/" },
      { name: "Grocery", href: "/grocery" },
      { name: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help centre", href: "#" },
      { name: "Track order", href: "#" },
      { name: "Refund policy", href: "#" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink-800 bg-ink-950 text-ink-300">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" showRing={false} />
              <p className="font-display text-2xl font-bold text-white">FoodHeaven</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Delicious food from the best local restaurants, delivered to your doorstep.
            </p>
          </div>

          {SITEMAP.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-ink-400 transition hover:text-brand-400"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-ink-400 transition hover:text-brand-400"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-8 sm:flex-row">
          <p className="text-sm text-ink-500">© {year} FoodHeaven. All rights reserved.</p>
          <p className="text-sm text-ink-600">Made with care for food lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
