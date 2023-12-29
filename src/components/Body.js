import { useState, useEffect, useContext } from 'react';

import RestaurantCard, { withPromotedLabel } from "./RestaurantCard";
import { swiggy_api_URL } from '../utils/constants';
import Shimmer from './Shimmer';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';


const Body = () => {
    // Local State Variable - Super Power Variable
    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchText, setSerachText] = useState("");

    // const RestaurantCardPromoted = withPromotedLabel(withPromotedLabel);

    useEffect(() => {
      fetchData();
    }, []);
 
    async function fetchData() {
        const swiggy_api_URL = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING';
      
        try {
            const response = await fetch(`https://thingproxy.freeboard.io/fetch/${swiggy_api_URL}`, {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:54442',
                'Content-Type': 'application/json',
                // Add any other headers if needed
            },
            });
        
            console.log('Response:', response);
        
            const json = await response.json();
            console.log('JSON Data:', json);
      
         
        // initialize checkJsonData() function to check Swiggy Restaurant data
        async function checkJsonData(jsonData){
            for(let i=0; i< jsonData?.data?.cards.length; i++){

                // initialize checkData for Swiggy Restaurant data
                let checkData = json?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants;

                // if checkData is not undefined then return it
                if(checkData !== undefined){
                    return checkData;
                }
            }
        }
        const resData = await checkJsonData(json);
        

        setListOfRestaurant(resData);
        setFilteredRestaurant(resData);
        } catch (err) {
          console.log('Error:', err);
          // Handle the error as needed
        }
      }
      
  
    const onlineStatus = useOnlineStatus();

    if(onlineStatus === false)
       return <h1> Looks like you are offline!! Please check your internet connection</h1>

    const {loggedInUser, setUserName} = useContext(UserContext);

    return listOfRestaurants.length === 0 ? <Shimmer/> :(
        <div className="body">
            <div className="filter flex">
                <div className='search m-4 p-4'>
                    <input 
                       type="text" 
                       data-testid="searchInput"
                       className='border border-solid border-black' 
                       value={searchText}
                       onChange={(e) =>{
                           setSerachText(e.target.value);
                       }}
                       />
                    <button 
                        className='px-4 py-2 m-4 bg-green-100 rounded-lg'
                        onClick={() => {
                            // Filter the restaurant cards and update the UI
                            const filteredRestaurant = listOfRestaurants.filter((restaurant) => 
                            restaurant?.info?.name.toLowerCase().includes(searchText.toLowerCase()))

                            setFilteredRestaurant(filteredRestaurant);
                        }}>Search</button>
                </div>
                <div className='search m-4 p-4 flex items-center'>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg"
                    onClick={() =>{
                        const filteredList = listOfRestaurants.filter(
                            (res) => res.info.avgRating > 4.2
                        )
                        setFilteredRestaurant(filteredList);
                    }}
                    >
                    Top Rated Restaurant</button>
                    </div>
                    <div className="search m-4 p-4 flex items-center">
                    <label> UserName : </label>
                    <input
                        className="border border-black p-2"
                        value={loggedInUser}
                        onChange={(e) => setUserName(e.target.value)}
                    />
            </div>
            </div>
            <div className="flex flex-wrap">
                {filteredRestaurant.map((restaurant) => (
                    <Link
                        key={restaurant?.info.id}
                        to={"/restaurants/" + restaurant?.info?.id}
                    >
                        {/* if the restaurants is Promoted then add a Promoted lable to it  */}

                        {/* {restaurant.data.promoted ? (
                            <RestaurantCardPromoted key={restaurant?.info?.id} {...restaurant?.info} />  
                        ):( */}
                            <RestaurantCard key={restaurant?.info?.id} {...restaurant?.info} />  
                        {/* )} */}

                    </Link>
                ))}
            </div>
        </div>
    )
}


export default Body;