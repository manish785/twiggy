import { useState, useEffect, useContext } from 'react';

import RestaurantCard from "./RestaurantCard";
import { swiggy_api_URL } from '../utils/constants';
import Shimmer from './Shimmer';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { data } from './mocks/MOCK_RES_DATA'


const Body = () => {
    // Local State Variable - Super Power Variable
    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchText, setSerachText] = useState("");

    // const RestaurantCardPromoted = withPromotedLabel(withPromotedLabel);

    useEffect(() => {
      fetchData();
    }, []);
 
    function fetchData() {
      
        try {
            const json = data;
           
        
        // initialize checkJsonData() function to check Swiggy Restaurant data
        function checkJsonData(jsonData){
            for(let i=0; i< jsonData?.data?.cards.length; i++){

                // initialize checkData for Swiggy Restaurant data
                let checkData = json?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants;

                // if checkData is not undefined then return it
                if(checkData !== undefined){
                    return checkData;
                }
            }
        }
        const resData =  checkJsonData(json);
        

        setListOfRestaurant(resData);
        setFilteredRestaurant(resData);
        } catch (err) {
          // Handle the error as needed
        }
      }
      
  
    const onlineStatus = useOnlineStatus();

    if(onlineStatus === false)
       return <h1> Looks like you are offline!! Please check your internet connection</h1>

    const {loggedInUser, setUserName} = useContext(UserContext);

    return listOfRestaurants.length === 0 ? <Shimmer/> :(
        <div className="body">
            <div className="">
                <div className='flex flex-wrap justify-between'>
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
                            className='px-4 py-2 m-4 bg-violet-100 rounded-lg'
                            onClick={() => {
                                // Filter the restaurant cards and update the UI
                                const filteredRestaurant = listOfRestaurants.filter((restaurant) => 
                                restaurant?.info?.name.toLowerCase().includes(searchText.toLowerCase()))

                                setFilteredRestaurant(filteredRestaurant);
                            }}>Search</button>
                    </div>
                    <div className='search m-4 p-4 flex items-center'>
                        <button className="px-4 py-2 bg-violet-100 rounded-lg"
                        onClick={() =>{
                            const filteredList = listOfRestaurants.filter(
                                (res) => res.info.avgRating > 4.2
                            )
                            setFilteredRestaurant(filteredList);
                        }}
                        >
                        Top Rated Restaurant</button>
                    </div>
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