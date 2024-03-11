import { useState, useRef } from 'react';
// import { checkValidData } from '../utils/validate';
// import { auth } from "../utils/firebase";
import { USER_AVATAR } from "../utils/constants";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { BG_URL } from '../utils/constants';

const Checkout = () => {
    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const name = useRef(null);
    const email = useRef(null);
    const number = useRef(null);
    const address = useRef(null);
    const pincode = useRef(null);


    const navigate = useNavigate();



    const handleButtonClick = () => {
        // Validate the form data
        // const message = checkValidData(email.current.value, password.current.value);
       navigate('/payment');
    }

    return (
        <div className='mt-[-224px] full-screen'>
            <div className="absolute">
                <img
                    className="h-[800px] w-screen object-cover"
                    src={BG_URL}
                    alt="BG-IMG"
                />
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="absolute mt-[130px] h-[580px] w-[700px] left-0 right-0  p-4 md:p-8 mx-auto text-white bg-black rounded-lg my-36 bg-opacity-888 "
            >
                <h1 className="py-4 text-3xl font-bold">
                     Add Delivery Address
                </h1>
              
                <input
                    ref={name}
                    type="text"
                    placeholder="Full Name"
                    className="p-4 rounded-md my-2 w-full bg-black border-2"
                />
              
                <input
                    ref={email}
                    type="email"
                    placeholder="Email Address"
                    className="p-4 rounded-md my-2 w-full bg-black border-2"
                />
                
                <input
                    ref={number}
                    type="text"
                    placeholder="Number"
                    className="p-4 rounded-md my-2 w-full bg-black border-2"
                />

                 <input
                    ref={address}
                    type="text"
                    placeholder="Address"
                    className="p-4 rounded-md my-2 w-full bg-black border-2"
                />
                 <input
                    ref={pincode}
                    type="text"
                    placeholder="Pincode"
                    className="p-4 rounded-md my-2 w-full bg-black border-2"
                />
                <p className="text-[#e50914]">{errorMessage}</p>
               
                <button
                    className="p-4 my-6 rounded-md bg-[#e50914] hover:bg-[#d6180b] w-full font-medium"
                    onClick={handleButtonClick}
                >
                    Add Delivery Address
                </button>
                {/* <p
                    className="my-4 cursor-pointer opacity-100  hover:opacity-100 hover:underline"
                    onClick={toggleSignInForm}
                >
                    {isSignInForm
                        ? 'New User ? Sign Up Now'
                        : 'Already registered? Sign In Now'}
                </p> */}
            </form>
        </div>
    )
}

export default Checkout;