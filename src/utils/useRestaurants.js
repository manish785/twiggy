import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, GET_RESTAURANTS_URL } from "./constants";

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(GET_RESTAURANTS_URL);
      setRestaurants(response?.data?.data || []);
    } catch (err) {
      const isNetworkError =
        !err?.response &&
        (err?.code === "ERR_NETWORK" || err?.message === "Network Error");

      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      setError(
        isNetworkError
          ? isLocal
            ? "Cannot reach the API. Start the backend: cd backend && npm run dev"
            : `Cannot reach the API at ${API_BASE_URL}. Try again in a moment.`
          : err?.response?.data?.message || "Unable to fetch restaurants"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, isLoading, error, refetch: fetchRestaurants };
};

export default useRestaurants;
