import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider } from 'react-redux';

import Header from "./components/Header";
import Body from "./components/Body";
import About from "./components/About";
import Contact from "./components/Contact";
import Error from "./components/Error";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import PaymentPage from "./Pages/PaymentPage/index";
// import PaymentConfirm from "../Pages/PaymentPage/";
import PaymentConfirm from "./Pages/PaymentPage/components/PaymentConfirm";
import  Footer  from "./components/Footer";
import RestaurantMenu from "./components/RestaurantMenu";
import Login from "./components/Login";
import UserContext from "./utils/UserContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { ToastProvider } from 'react-toast-notifications';
import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'



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
    return(
        <ToastProvider autoDismiss autoDismissTimeout={5000} placement="top-left">
        <Auth0Provider
        domain="dev-ssvzdizyuhxdvzmr.us.auth0.com"
        clientId="tWBg4eMwkTui3fUFTtKyip5pnLKrNb0f"
        redirectUri= {window.location.origin}
        >
        <Provider store={appStore}> 
            <div className="app">
                <React.Fragment>
                    <ChakraProvider>
                        <Header />
                        <Outlet />
                    </ChakraProvider>
                    {/* <Footer/> */}
                </React.Fragment>
            </div>
        </Provider>
        </Auth0Provider>
        </ToastProvider>
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
                    path: '/checkout',
                    element: <Checkout/>
                },
                {
                    path: '/payment',
                    element: <PaymentPage/>
                },
                {
                    path: '/payment/confirm',
                    element: <PaymentConfirm/>
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