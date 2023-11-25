import { useState, useEffect } from 'react';

import RestaurantCard from "./RestaurantCard";
import { swiggy_api_URL } from '../utils/constants';
import Shimmer from './Shimmer';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';


const Body = () => {
    // Local State Variable - Super Power Variable
    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);

    const [searchText, setSerachText] = useState("");

    useEffect(() => {
      fetchData();
    }, []);
 
    async function fetchData()  {
        try{
            const response = await fetch(swiggy_api_URL);
            const json = await response.json();
             
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
        }catch(err){
            console.log('err', err);
            return;
        }
       
    }
   
  
    const onlineStatus = useOnlineStatus();

    if(onlineStatus === false)
       return <h1> Looks like you are offline!! Please check your internet connection</h1>

    return listOfRestaurants.length === 0 ? <Shimmer/> :(
        <div className="body">
            <div className="filter flex">
                <div className='search m-4 p-4'>
                    <input 
                       type="text" 
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
                            // serachText
                            // console.log(searchText);

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
            </div>
            <div className="flex flex-wrap">
                {filteredRestaurant.map((restaurant) => (
                    <Link
                        key={restaurant?.info.id}
                        to={"/restaurants/" + restaurant?.info?.id}
                    >
                        <RestaurantCard key={restaurant?.info?.id} {...restaurant?.info} />  
                    </Link>
                ))}
            </div>
        </div>
    )
}


export default Body;