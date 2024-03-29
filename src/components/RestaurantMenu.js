import Shimmer from './Shimmer';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { swiggy_menu_api_URL } from '../utils/constants';
import useRestaurantMenu from '../utils/useRestaurantMenu';
import RestaurantCategory from './RestaurantCategory';
import { MENU_ITEM_URL } from "../utils/constants";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import useShowToast from "../CustomHooks/useShowToast";
import {
  Button,
  useBreakpointValue
} from "@chakra-ui/react";
import backgroundColor from './backgroundColor';
import { useToasts } from 'react-toast-notifications';


const RestaurantMenu = () => {
    const { resId } = useParams();
    const dummy = 'Dummy Data';
    const resInfo = useRestaurantMenu(resId);
    const [showIndex, setShowIndex] = useState(null);
    const { addToast } = useToasts();
    const [data, setData] = useState(null);  
    const [showToast] = useShowToast();
    const [visible, setVisible] = useState(false);
    // const textSize = useBreakpointValue({
    //   base: "lg",
    //   md: "md",
    // });
    const { isAuthenticated } = useAuth0();
    const dispatch = useDispatch();
    
    const addFoodItem = (item) => {
        //dispatch an action
        dispatch(addItem(item));
      };

    if(resInfo === null){
        return <Shimmer/>
    }

    // const categories =
    // resInfo?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
    //   (c) =>
    //     c.card?.["card"]?.["@type"] ===
    //     "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
    // );

    // setData(categories);

    // if(data === null){
    //   return <Shimmer/>
    // }

    const {name, cuisines, costForTwoMessage} = resInfo?.info;
    const itemCards = resInfo?.itemCards;

    if (itemCards.length != 0) {
        itemCards.forEach((element) => {
          element.card.info.qty = 0;
        });
      }

    const HandleAddtoBag = () => {
      if (!isAuthenticated) {
        // showToast("Please login to use add to bag", "info");
        addToast('Please login to use add to bag', {
          appearance: 'error',
          autoDismiss: true
      })
        return;
      }
      // showToast("Product added successfully", "success");
      {itemCards?.map((item) => (  
        addFoodItem(item.card.info)
      ))}

      addToast('Product added successfully', {
        appearance: 'success',
        autoDismiss: true
    })
      setVisible(true);
    };
    
    

    return (
        <div className="menu lg:mx-40 ">
        <p className="m-2 text-xs text-slate-700">Home/{name}</p>
  
        <div className="flex justify-between items-center">
          <div>
            <h1 className=" m-3 text-3xl  font-bold">{name}</h1>
            <p className="mx-3">{cuisines.join(", ")}</p>
            <p className="mx-3">{costForTwoMessage}</p>
          </div>
        </div>
  
        <div className="line h-0.5 bg-slate-800 mx-3 my-2"></div>
  
        {/* city, cost for two , time */}
  
        <h2 className="mx-3 font-bold text-xl my-3">Menu</h2>
        <ul data-testid="menu" className="mx-3">
          {itemCards?.map((item) => (
            <li
              className="border-b-2 flex justify-between p-2 items-center duration-200 hover:scale-105"
              key={item.card.info.id}
            >
              <div className="flex">
                <img
                  className="p-2 w-40 rounded-xl"
                  src={MENU_ITEM_URL + item.card.info.imageId}
                ></img>
                <div className="m-2 text-slate-700">
                  <p className="text-lg font-semibold">{item.card.info.name} </p>
                  <p className="m-1">
                    {" Rs."}
                    {item.card.info.price / 100 ||
                      item.card.info.defaultPrice / 100}
                  </p>
                  <button className="text-green-700 m-1 font-semibold">
                    {item.card.info.ratings.aggregatedRating.rating} ★
                  </button>
                </div>
              </div>
              {/* <Button
                display={!visible ? "block" : "none"}
                marginTop="10px"
                color={"white"}
                colorScheme="green"
                backgroundColor={backgroundColor}
                onClick={() => HandleAddtoBag()}
                // fontSize={textSize}
              >
              Add to bag
             </Button> */}
              <button
                // onClick={HandleAddtoBag}
                data-testid="addBtn"
                className="p-1 md:p-2 m-1 md:m-2 rounded-md text-sm md:text-md shadow-lg text-white bg-blue-800 hover:bg-blue-500 active:bg-blue-950 hover:scale-105"
                onClick={HandleAddtoBag}
                // onClick={() => addFoodItem(item.card.info)}
              >
                + Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
};


export default RestaurantMenu;