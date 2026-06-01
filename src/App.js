import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "react-hot-toast";

import AuthRedirectHandler from "./components/AuthRedirectHandler";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Contact from "./components/Contact";
import Error from "./components/Error";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import RestaurantMenu from "./components/RestaurantMenu";
import Login from "./components/Login";
import PaymentPage from "./Pages/PaymentPage/index";
import PaymentConfirm from "./Pages/PaymentPage/components/PaymentConfirm";
import PageLoader from "./components/ui/PageLoader";
import appStore from "./utils/appStore";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./utils/constants";
import {
  clearAuthReturnTo,
  peekAuthReturnTo,
} from "./utils/authReturnTo";
import { getAuth0LoginParams } from "./utils/auth0Config";

const Grocery = lazy(() => import("./components/Grocery"));
const About = lazy(() => import("./components/About"));

const auth0Domain =
  AUTH0_DOMAIN || "dev-5k6wn3xfw6lvzvkj.us.auth0.com";
const auth0ClientId =
  AUTH0_CLIENT_ID || "4d8HhuQt62vCakX8rch92Elc6K0HkLYp";

/** Auth0 at router root so login redirect and callback work on every route. */
const Auth0Root = () => {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      cacheLocation="localstorage"
      authorizationParams={getAuth0LoginParams()}
      onRedirectCallback={(appState) => {
        const returnTo = appState?.returnTo || peekAuthReturnTo() || "/";
        clearAuthReturnTo();
        navigate(returnTo, { replace: true });
      }}
    >
      <Provider store={appStore}>
        <AuthRedirectHandler />
        <Outlet />
      </Provider>
    </Auth0Provider>
  );
};

const AppShell = () => (
  <div className="flex min-h-screen flex-col bg-ink-50">
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "!rounded-xl !font-medium !shadow-card",
        success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
      }}
    />
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const LazyFallback = () => <PageLoader />;

const appRouter = createBrowserRouter([
  {
    element: <Auth0Root />,
    errorElement: <Error />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <Body /> },
          {
            path: "/about",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <About />
              </Suspense>
            ),
          },
          { path: "/contact", element: <Contact /> },
          { path: "/cart", element: <Cart /> },
          { path: "/checkout", element: <Checkout /> },
          { path: "/payment", element: <PaymentPage /> },
          { path: "/payment/confirm", element: <PaymentConfirm /> },
          {
            path: "/grocery",
            element: (
              <Suspense fallback={<LazyFallback />}>
                <Grocery />
              </Suspense>
            ),
          },
          { path: "/restaurants/:resId", element: <RestaurantMenu /> },
          { path: "/login", element: <Login /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter} />
);
