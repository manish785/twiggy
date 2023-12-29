import { useState, useEffect } from 'react';

const useRestaurantMenu = (resId) => {
  const [resInfo, setResInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const swiggy_menu_api_URL = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=21.1702401&lng=72.83106070000001&&submitAction=ENTER&restaurantId=${resId}`;
    
    try {
      const response = await fetch(`https://thingproxy.freeboard.io/fetch/${swiggy_menu_api_URL}`, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:1234',
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
      });

      const json = await response.json();
      setResInfo(json.data);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      // Handle the error as needed
    }
  };

  return resInfo;
};

export default useRestaurantMenu;
