import { LOGO_URL } from '../utils/constants';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const Header = () => {
    const { loggedInUser } = useContext(UserContext);
    const navigate = useNavigate();
    
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
                        {btnNameReact === 'login' ? (
                            <button className='ml-7 mt-2' onClick={handleSignIn}>
                                <p className='font-bold text-xl mt-[-9px]'>Login</p>
                            </button>
                        ) : (
                            <button className='ml-7 mt-2' onClick={handleSignOut}>
                                <p className='font-bold text-xl mt-[-7px] mr-[1px]'>Hi, Guest</p>
                                <p className='font-bold  text-xl pt-[3px]'>Logout</p>
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Header;