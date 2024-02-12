import { useState, useEffect, useContext, useRef } from 'react';
import RestaurantCard from "./RestaurantCard";
import Shimmer from './Shimmer';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { data } from './mocks/MOCK_RES_DATA';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import leftA from "../img/left-arrow.png";
// import rightA from "../img/right-arrow.png";


const Body = () => {
    // Local State Variable - Super Power Variable
    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchText, setSerachText] = useState("");
    const sliderRef = useRef(null);
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

    const sliderSettings = {
        infinite: false, // Set infinite to false to disable infinite movement
        slidesToShow: 8,
        slidesToScroll: 1,
        responsive: [
            {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
              infinite: false,
            },
            },
            {
                breakpoint: 600,
                settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                },
            },
            ],
        };
    
    const handleNext = () => {
        if (sliderRef.current) {
        sliderRef.current.slickNext();
        }
    };
        
    const handlePrev = () => {
        if (sliderRef.current) {
        sliderRef.current.slickPrev();
        }
    };
      
  
    const onlineStatus = useOnlineStatus();

    if(onlineStatus === false)
       return <h1> Looks like you are offline!! Please check your internet connection</h1>

    const {loggedInUser, setUserName} = useContext(UserContext);

    return (
        <div className="body">
            {listOfRestaurants.length === 0 ? (
                <Shimmer />
            ) : (
                <>
                 <div className='flex h-[30px] w-full flex justify-between'>
                        <h1 className='font-bolder text-2xl font-thin ml-[12px]'>What's on your mind?</h1>
                        <div className='flex mt-[4px]'>
                            <img 
                            className='h-[20px] bg-gray bg-gray-100'
                            src='https://cdn-icons-png.flaticon.com/512/109/109618.png'
                            alt=''
                            />
                            <img 
                            className='h-[20px] pl-[9px] mr-[20px] bg-gray-100'
                            src='https://cdn-icons-png.flaticon.com/512/109/109617.png'
                            alt=''
                            />
                        </div>
                    </div>
                <div className="keen-slider bg-white flex mt-[-1px] h-[200px] w-full">
            

                 <div className="w-full keen-slider__slide">
                        <img 
                          className="w-full pointer-events-none h-[110px] w-[90px]" 
                          alt="" 
                          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1675667625/PC_Creative%20refresh/North_Indian_4.png" 
                          />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img className="w-full pointer-events-none  h-[110px] w-[90px]" alt="" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1675667625/PC_Creative%20refresh/Biryani_2.png" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img  className="w-full pointer-events-none   h-[110px] w-[90px]" alt="" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/Burger.png" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img  className="w-full pointer-events-none   h-[110px] w-[90px]" alt=""src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029853/PC_Creative%20refresh/3D_bau/banners_new/Paratha.png" />
                    </div>
            
                    <div className="w-full keen-slider__slide">
                        <img className="w-full pointer-events-none   h-[110px] w-[90px]" alt="" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029844/PC_Creative%20refresh/3D_bau/banners_new/Chole_Bature.png" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img className="w-full pointer-events-none   h-[110px] w-[90px]" alt="" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029858/PC_Creative%20refresh/3D_bau/banners_new/Rolls.png" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img className="w-full pointer-events-none   h-[110px] w-[90px]" alt="" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029848/PC_Creative%20refresh/3D_bau/banners_new/Chinese.png" />
                    </div> 

                    <div className="w-full keen-slider__slide">
                        <img  className="w-full pointer-events-none  h-[110px] w-[90px]" alt="" 
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029851/PC_Creative%20refresh/3D_bau/banners_new/Khichdi.png" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1675667626/PC_Creative%20refresh/South_Indian_4.png" 
                        className="w-full pointer-events-none h-[110px] w-[90px]" alt="" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029854/PC_Creative%20refresh/3D_bau/banners_new/Pasta.png" 
                        className="w-full pointer-events-none  h-[110px] w-[90px]" alt="" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029844/PC_Creative%20refresh/3D_bau/banners_new/Chole_Bature.png" 
                        className="w-full pointer-events-none  h-[110px] w-[90px]" alt="" />
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029850/PC_Creative%20refresh/3D_bau/banners_new/Gulab_Jamun.png" 
                        className="w-full pointer-events-none  h-[110px] w-[90px]" alt=""/>
                    </div>

                    <div className="w-full keen-slider__slide">
                        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/v1674029854/PC_Creative%20refresh/3D_bau/banners_new/Pav_Bhaji.png" 
                        className="w-full pointer-events-none  h-[110px] w-[90px]" alt="" /> 
                    </div>

                    {/* <div className="hidden mt-2 md:flex justify-between">
                        <button
                        onClick={handlePrev}
                        className="bg-white text-white -translate-y-28 md:-translate-y-32 -translate-x-8 rounded-full h-10 w-10"
                        >
                        <img src='https://cdn-icons-png.flaticon.com/512/109/109618.png' alt="Left Arrow" />
                        </button>
                        <button
                        onClick={handleNext}
                        className="bg-white text-white -translate-y-28  lg:-translate-y-32 lg:translate-x-6 translate-x-4 rounded-full h-10 w-10"
                        >
                        <img src='https://cdn-icons-png.flaticon.com/512/109/109617.png' alt="Right Arrow" className="h-10 w-10" />
                        </button>
                    </div> */}
                </div>
                </>
                
            )}

            <div className='body bg-gray-100 mt-[-100px]'>
                <div className='flex justify-between mt-4'>
                    <div>
                        <input 
                            type='text'
                            placeholder=""
                            className='m-2 mx-9 p-2 border border-black border-solid rounded-lg'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg' onClick={() => {
                            const filteredList = listOfRestaurants.filter((res) => res?.info?.name.toLowerCase().includes(searchText.toLowerCase()));
                            setFilteredRestaurant(filteredList);
                        }}>
                            Search
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg' onClick={() => {
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.avgRating > 4);
                            setFilteredRestaurant(filteredResList);
                        }}>
                            Top Rated Restaurants
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg' onClick={() => {
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.veg === true);
                            setFilteredRestaurant(filteredResList);
                        }}>
                            Pure Veg
                        </button>
                    </div>
                    <div>
                        <button className='px-2 py-2 m-4 bg-pink-100 rounded-lg' onClick={() => {
                            const filteredResList = listOfRestaurants.filter((res) => res?.info?.sla?.deliveryTime < 30);
                            setFilteredRestaurant(filteredResList);
                        }}>
                            Fast Delivery
                        </button>
                    </div>
                </div>
                <div className='flex flex-wrap'>
                    {filteredRestaurant.map((res) => (
                        <Link
                            key={res?.info?.id}
                            to={"/restaurants/" + res?.info?.id}
                        >
                            {/* Placeholder for RestaurantCard component */}
                            <RestaurantCard key={res.info.id} {...res.info}/>
                        </Link>
                    ))}
                </div>
            </div>

           <div className='mt-[-1px]'>
               <Footer/>
           </div> 
        </div>
    );
}

export default Body;