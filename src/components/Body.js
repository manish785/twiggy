import { useState, useEffect, useContext } from 'react';
import RestaurantCard from "./RestaurantCard";
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
            <div className='body bg-gray-100'>
                <div className='flex justify-between mt-4'>
                    <div>
                        <input 
                        type='text'
                        placeholder=""
                        className='m-2 mx-2 p-2 border border-black border-solid rounded-lg'
                        value={searchText}
                        onChange={(e) => setSerachText(e.target.value)}
                        />
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg'
                        onClick={() => {
                            //Filter the restaurants on the click
                            const filteredList = filteredRestaurant.filter((res) => res?.info?.name.toLowerCase().includes(searchText.toLowerCase()));
                            setFilteredRestaurant(filteredList);
                        }}
                        >
                            Search
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg'
                        onClick={() => {
                            //Filter the restaurants on the click
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.avgRating > 4);
                            setFilteredRestaurant( filteredResList );
                        }}
                        >
                            Top Rated Restaurants
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg'
                        onClick={() => {
                            //Filter the restaurants on the click
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.veg == true);
                            setFilteredRestaurant( filteredResList );
                        }}
                        >
                            Pure Veg
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg'
                        onClick={() => {
                            //Filter the restaurants on the click
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.sla?.deliveryTime < 30);
                            setFilteredRestaurant( filteredResList );
                        }}
                        >
                           Fast Delivery
                        </button>
                    </div>
                </div>
                </div>
                <div className='flex flex-wrap'>
                    {filteredRestaurant.map((res) => (
                        <Link
                            key={res?.info?.id}
                            to={"/restaurants/" + res?.info?.id}
                        >
                        <RestaurantCard key={res.info.id} {...res.info}/>
                        </Link>
                    ))}
                </div>
        </div>
    )
}


export default Body;