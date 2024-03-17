import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import ItemList from "./ItemList";


const Cart = () => {
    // subscribe the right portion of the store 
    const cartItems = useSelector((store) => store.cart.items);
   
    const dispatch = useDispatch();

    const handleClearCart = () => {
      dispatch(clearCart());
    };

    return (
      <div className="text-center m-4 p-4">
        <h1 className="text-3xl font-bold">Cart</h1>
        <div className="w-6/12 m-auto">
          <button
            className="h-[60px] w-[120px] p-2 m-2 bg-black text-white rounded-lg"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
          {cartItems?.length === 0 && (
            <h1> Cart is empty. Add Items to the cart!</h1>
          )}
          <ItemList items={cartItems} />
        </div>
      </div>
    );
};


export default Cart;