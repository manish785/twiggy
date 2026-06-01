import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PageLoader from "./ui/PageLoader";
import { loginWithAuth } from "../utils/auth0Config";
import { saveAuthReturnTo } from "../utils/authReturnTo";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const searchParams = new URLSearchParams(location.search);
  const returnTo =
    location.state?.returnTo || searchParams.get("returnTo") || "/";

  useEffect(() => {
    saveAuthReturnTo(returnTo);
  }, [returnTo]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  if (isLoading) {
    return <PageLoader label="Checking session..." />;
  }

  if (isAuthenticated) return null;

  return (
    <div className="page-shell flex min-h-[calc(100vh-5rem)] items-center justify-center bg-hero-gradient">
      <div className="page-container flex justify-center py-12">
        <div className="card-surface w-full max-w-md p-8 sm:p-10">
          <div className="text-center">
            <span className="text-5xl">🍽️</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-ink-900">
              Welcome to FoodHeaven
            </h1>
            <p className="mt-2 text-ink-500">
              Sign in to save your preferences and checkout faster.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loginWithAuth(loginWithRedirect, returnTo)}
            className="btn-primary mt-8 w-full !py-4"
          >
            Continue with Auth0
          </button>

          <Link
            to="/"
            className="mt-4 block text-center text-sm font-medium text-ink-500 hover:text-brand-600"
          >
            Browse as guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
