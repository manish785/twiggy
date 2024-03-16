import { useDispatch } from 'react-redux';
import { addItem, increaseQuantity, decreaseQuantity, removeItem } from '../utils/cartSlice';
import { CDN_URL, MENU_ITEM_URL } from '../utils/constants';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import backgroundColor from './backgroundColor';
import { useToasts } from 'react-toast-notifications';

import { AddressSchema } from "../Schema";

const initialValue = {
  name: "",
  email: "",
  number: "",
  address: "",
  pincode: "",
};

const ItemList = (props) => {
    const { items } = props;
    const { addToast } = useToasts();

    const dispatch = useDispatch();
    const increaseQty = (item) => {
      dispatch(increaseQuantity(item));
    };
    const decreaseQty = (item) => {
      dispatch(decreaseQuantity(item));
    };
    const remove = (item) => {
      dispatch(removeItem(item));
    }

    const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: initialValue,
      validationSchema: AddressSchema,
      onSubmit: (value, action) => {
        Dispatch(Address(value));
        addToast('Address added successfully', {
          appearance: 'success',
          autoDismiss: true
      })
        navigate("/user/payment");
        action.resetForm();
      },
    });


    return (
      <div>
        {items.map((item) => (
          <div key={item.imageId} className="flex justify-between flex-nowrap">
            <div className="flex"> 
              <img className="p-2 h-[100px] w-[100px] md:w-40 rounded-md" src={MENU_ITEM_URL + item.imageId} />
              <div className="mt-3 m-2 mr-10">
                <h2 className="text-base lg:text-lg font-bold m-[36px]">{item.name}</h2>
              </div>
            </div>
    
            <div className="p-4 m-auto flex flex-col">
              <div className="sm:text-center">
                <button className="m-0 bg-slate-200 p-1 pl-2 rounded-l-lg text-red-700 font-bold"
                  onClick={() => {
                    item.qty === 1 ? remove(item) : decreaseQty(item);
                  }}
                >
                  -
                </button>
                <button className="m-0 p-1 bg-slate-200">{item.qty}</button>
                <button className="bg-slate-200 m-0 p-1 pr-2 rounded-r-lg text-green-700 font-bold"
                  onClick={() => increaseQty(item)}
                >
                  +
                </button>
              </div>
              <span className="px-3 sm:text-center m-4">
                {" "}
                {" Rs."}
                {(item.price * item.qty) / 100 || (item.defaultPrice * item.qty) / 100}
              </span>
            </div>
          </div>
        ))}

        {items.length === 0 && (
        <div className="border border-gray-300 m-[40px] flex flex-col justify-center items-center gap-4 p-6 w-11/12 mx-auto">
        <h1 className="text-2xl font-semibold m-[4px] pb-[4px]">Your cart is Empty</h1>
        <p className='font-thin text-sm'>You can go to home page to view more restaurants</p>
        <Link to="/" className="bg-blue-500 m-[10px] p-[20px] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out">
          SEE RESTAURANTS NEAR YOU
        </Link>
      </div>
      )}
      
      {items.length > 0 && (
            <div className="border h-[100px] w-[900px] flex justify-between border-gray-300 m-[40px] flex flex-col justify-center items-center gap-4 p-6 w-11/12 mx-auto">
            <div className='flex justify-between'>
              <button className='bg-green-200 h-[50px] w-[120px] rounded-md text-bold text-xl'>
                <Link to='/'>Empty Cart</Link>
               </button>
              <button className='bg-green-200 h-[50px] w-[120px] rounded-md text-bold text-xl ml-[300px]'>
                <Link to='/checkout'>
                  Checkout
                </Link>
               </button>
            </div>
        </div>
      )}
      </div>
    );
};


export default ItemList;
