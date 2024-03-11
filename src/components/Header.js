import { LOGO_URL } from '../utils/constants';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAuth0 } from "@auth0/auth0-react";
import useShowToast from "../CustomHooks/useShowToast";
import backgroundColor from "./backgroundColor";


import {
    Flex,
    Button,
    Text,
  } from "@chakra-ui/react";


const Header = () => {
    const { loggedInUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    const [showToast] = useShowToast();

    useEffect(() => {
        if (isAuthenticated) {
        showToast("Login Successfully", "success");
        }
    }, [isAuthenticated]);
    
    // Subscribing to the store using a Selector
    const cartItems = useSelector((store) => store.cart.items);
    const onlineStatus = useOnlineStatus();

    const [btnNameReact, setBtnNameReact] = useState('login');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setBtnNameReact('logout');
            } else {
                setBtnNameReact('login');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = () => {
        navigate('/login');
    }

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            setBtnNameReact('login'); // Change button to login after sign out
        })
        .catch((error) =>{
            navigate('/error');
        })
    }

    return (
        <div className="flex justify-between h-[150px] w-full bg-pink-100 shadow-lg sm:bg-yellow-50 lg:bg-green-50">
            <div className="logo-container">
            <img className="h-[150px]" src={ LOGO_URL } alt="Logo" />
            </div>
            <div className="flex items-center">
                <ul className='flex p-4 m-4'>
                    <li className='px-3'>
                       Online Status: {onlineStatus ? "✅" : "🚫"}
                    </li>
                    <li className='px-3'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='px-3'> 
                        <Link to="/about">About Us </Link>
                    </li>
                    <li className='px-3'>
                        <Link to="/contact">Contact Us</Link>
                    </li>
                    <li className='px-3'>
                        <Link to="/grocery">Grocery</Link>
                    </li>
                    <li className='px-3 font-bold text-xl'>
                        <Link to='/cart'> Cart - ({cartItems.length} items) </Link>
                    </li>
                    <li>
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-10">
                            <p className="text-sm font-bold text-xl">Welcome {user.name}</p>
                
                            <button
                                className={`bg-${backgroundColor} text-white-700 font-bold text-xl text-bold border-1 border-gray-300 hover:text-black`}
                                onClick={() => {
                                    showToast("Logout Successfully", "success", 5000);
                                    logout({ logoutParams: { returnTo: window.location.origin } });
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                        className='h-[30px] w-[80px] text-white-700 font-bold text-xl'
                        onClick={() => loginWithRedirect()}
                         >
                        Login
                       </button>
                    )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Header;