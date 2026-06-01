import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import PageLoader from "./ui/PageLoader";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnTo = location.state?.returnTo || "/";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, returnTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !name.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, name });
      toast.success("Logged in successfully");
      navigate(returnTo, { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader label="Loading..." />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="page-shell flex min-h-[calc(100vh-5rem)] items-center justify-center bg-hero-gradient">
      <div className="page-container flex justify-center py-12">
        <div className="card-surface w-full max-w-md p-8 sm:p-10">
          <div className="text-center">
            <span className="text-5xl">🍽️</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-ink-900">
              Sign in to FoodHeaven
            </h1>
            <p className="mt-2 text-ink-500">
              Use your name and email to checkout and pay. No external account
              needed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-ink-700"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manish Kumar"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-ink-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full !py-4"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </form>

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
