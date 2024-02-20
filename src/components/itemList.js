import { useDispatch } from 'react-redux';
import { addItem, increaseQuantity, decreaseQuantity, removeItem } from '../utils/cartSlice';
import { CDN_URL, MENU_ITEM_URL } from '../utils/constants';


const ItemList = (props) => {
    const { items } = props;
    console.log('hi', items);
  
    const { imageId, name, qty, price, defaultPrice, isVeg } = items[0];
    console.log('manish', imageId);
    const dispatch = useDispatch();
    const increaseQty = (item) => {
      //dispatch an action
      dispatch(increaseQuantity(item));
    };
    const decreaseQty = (item) => {
      //dispatch an action
      dispatch(decreaseQuantity(item));
    };
    const remove= (item)=>{
      dispatch(removeItem(item));
    }

  // const decreaseQty=(item)=>{
  //     dispatch(decreaseQuantity(item));
  // };

    return (
      <div className="flex justify-between flex-nowrap ">
        <div className="flex"> 
          <img className="p-2 w-28 md:w-40" src={MENU_ITEM_URL + imageId} />
          <div className="mt-3 m-2 mr-10">
            <h2 className=" text-base lg:text-lg font-bold">{name}</h2>
          </div>
        </div>

        <div className="p-4  m-auto flex flex-col">
          <div className="sm:text-center">
          <button className=" m-0 bg-slate-200 p-1 pl-2 rounded-l-lg text-red-700 font-bold"
              onClick={() => {
                (qty==1) ? remove(items) : decreaseQty(items);
              }}
            >
              -
            </button>
            <button className=" m-0 p-1 bg-slate-200">{qty}</button>
            <button className=" bg-slate-200 m-0 p-1 pr-2 rounded-r-lg text-green-700 font-bold"
              onClick={() => increaseQty(items)}
            >
              +
            </button>
          </div>
            <span className="px-3 sm:text-center m-4">
            {" "}
            {" Rs."}
            {(price * qty) / 100 || (defaultPrice * qty) / 100}
            </span>
        </div>
      </div>
    );
};
export default ItemList;