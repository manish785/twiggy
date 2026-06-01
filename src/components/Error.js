import { useRouteError, Link } from "react-router-dom";

const Error = () => {
  const err = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 text-center">
      <p className="font-display text-8xl font-bold text-brand-500">
        {err?.status || "404"}
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        {err?.statusText || "Something went wrong"}
      </h1>
      <p className="mt-2 max-w-md text-ink-500">
        {err?.message || "The page you're looking for doesn't exist or an error occurred."}
      </p>
      <Link to="/" className="btn-primary mt-8">
        Go back home
      </Link>
    </div>
  );
};

export default Error;
