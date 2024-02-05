import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider } from 'react-redux';

import Header from "./components/Header";
import Body from "./components/Body";
//import About from "./components/About";
import Contact from "./components/Contact";
import Error from "./components/Error";
import Cart from "./components/Cart";
import  Footer  from "./components/Footer";
import RestaurantMenu from "./components/RestaurantMenu";
import Login from "./components/Login";
import UserContext from "./utils/UserContext";

import appStore from "./utils/appStore";
//import Grocery from "./components/Grocery";

// Chunking
// Code Spiliting
// Dynamic Bundling
// Lazy Loading
// on demand loading

const Grocery = lazy(() => import('./components/Grocery'));
const About = lazy(() => import('./components/About'));


const AppLayout = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
      // Make an API call and send username and password
      const data = {
        name: 'Manish Kumar'
      };
      setUserName(data.name);
    }, []);

    return(
        <Provider store={appStore}> 
            <UserContext.Provider value={{loggedInUser: userName, setUserName}}>
            <div className="app">
                <React.Fragment>
                    <Header />
                    <Outlet />
                    {/* <Footer/> */}
                </React.Fragment>
            </div>
        </UserContext.Provider>
        </Provider>
    )
}

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children:[
                {
                    path: '/',
                    element: <Body/>
                },
                {
                    path: '/about',
                    element:  <Suspense fallback={<h1>Loading......</h1>}>
                        <About/>
                    </Suspense>
                },
                {
                    path: '/contact',
                    element: <Contact/>
                },
                {
                path: '/grocery',
                element: <Suspense fallback={<h1>Loading......</h1>}>
                    <Grocery/>
                </Suspense>
            },
            {
                path: '/restaurants/:resId',
                element: <RestaurantMenu/>
            },
            {
                path: '/cart',
                element: <Cart/>
            },
            {
                path: '/login',
                element: <Login/>
            },
        ],
        errorElement: <Error/>
    },
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);