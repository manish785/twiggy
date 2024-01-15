import { useState, useEffect } from 'react';
import { MENU_DATA } from '../components/mocks/MOCK_MENU_DATA';


const useRestaurantMenu = (resId) => {
  const [resInfo, setResInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =  () => {
    
    try {
      const json = MENU_DATA.find(obj=> obj.id===resId);
      setResInfo(json.data);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      // Handle the error as needed
    }
  };

  return resInfo;
};

export default useRestaurantMenu;
