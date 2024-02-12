import { LOGO_URL } from '../utils/constants';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { useSelector } from 'react-redux';

const Header = () => {
    const [btnNameReact, setBtnNameReact] = useState('login');
    const { loggedInUser } = useContext(UserContext);

    // Subscribing to the store using a Selector
    const cartItems = useSelector((store) => store.cart.items);
    const onlineStatus = useOnlineStatus();

    return (
        <div className="flex justify-between h-[150px] w-full bg-pink-100 shadow-lg sm:bg-yellow-50 lg:bg-green-50">
            <div className="logo-container">
                <img className="h-[150px]" src={ LOGO_URL } />
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
                    <li className='px-3 font-bold text-xl'>
                        <Link to='/login'>Logout</Link>
                    </li>
                    {/* <button
                    className='login'
                    onClick={() =>{
                        btnNameReact === 'Login'
                        ? setBtnNameReact('Logout')
                        : setBtnNameReact('Login')
                    }}
                    >
                    {btnNameReact}
                    </button> */}
                    <li className='px-4'>{loggedInUser}</li>
                </ul>
            </div>
        </div>
    )
}


export default Header;