import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

import { LOGO_URL } from "../utils/constants";
import useOnlineStatus from "../utils/useOnlineStatus";

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/grocery", label: "Grocery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const { itemCount } = useSelector((state) => state.cart);
  const onlineStatus = useOnlineStatus();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="page-container flex items-center justify-between gap-3 py-3 sm:gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          onClick={closeMenu}
        >
          <img
            src={LOGO_URL}
            alt="FoodHeaven"
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-100 sm:h-12 sm:w-12"
          />
          <div className="hidden min-[400px]:block">
            <p className="font-display text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              FoodHeaven
            </p>
            <p className="hidden text-xs text-ink-500 sm:block">Food delivered fast</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden rounded-full px-2.5 py-1 text-xs font-medium md:inline-flex ${
              onlineStatus
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {onlineStatus ? "● Online" : "● Offline"}
          </span>

          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 rounded-xl border border-ink-200 bg-ink-50 px-2.5 py-2 text-sm font-semibold text-ink-800 transition hover:border-brand-300 hover:bg-brand-50 sm:gap-2 sm:px-3"
            onClick={closeMenu}
          >
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              className="btn-secondary hidden !px-3 !py-2 text-sm text-red-600 hover:border-red-200 hover:bg-red-50 sm:inline-flex md:!px-4"
              onClick={() => {
                toast.success("Logged out");
                logout({ logoutParams: { returnTo: window.location.origin } });
              }}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary hidden !px-3 !py-2 text-sm sm:inline-flex md:!px-4"
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-xl lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink-900/50 lg:hidden"
            aria-label="Close menu overlay"
            onClick={closeMenu}
          />
          <nav
            className="fixed inset-x-0 top-[65px] z-50 max-h-[calc(100vh-65px)] overflow-y-auto border-b border-ink-100 bg-white p-4 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-ink-50"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-ink-100 pt-4">
              {isAuthenticated ? (
                <>
                  <p className="mb-3 px-4 text-sm font-medium text-ink-600">
                    Hi, {user?.given_name || user?.name?.split(" ")[0]}
                  </p>
                  <button
                    type="button"
                    className="btn-secondary w-full text-red-600"
                    onClick={() => {
                      closeMenu();
                      logout({ logoutParams: { returnTo: window.location.origin } });
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => {
                    closeMenu();
                    loginWithRedirect();
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
