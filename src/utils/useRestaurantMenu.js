import axios from "axios";
import { useState, useEffect } from "react";
import { getRestaurantMenuUrl } from "./constants";

const useRestaurantMenu = (resId) => {
  const [resInfo, setResInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resId) {
      return;
    }
    fetchData();
  }, [resId]);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await axios.get(getRestaurantMenuUrl(resId));
      setResInfo(response?.data?.data || null);
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to fetch menu");
    }
  };

  return { resInfo, error };
};

export default useRestaurantMenu;
