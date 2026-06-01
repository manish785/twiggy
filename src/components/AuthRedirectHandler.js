import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";

import { consumeAuthReturnTo } from "../utils/authReturnTo";

/**
 * After Auth0 callback, send the user to the path saved before login (e.g. /payment).
 */
const AuthRedirectHandler = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const handledRef = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || handledRef.current) {
      return;
    }

    const pendingReturnTo = consumeAuthReturnTo();
    if (!pendingReturnTo || pendingReturnTo === location.pathname) {
      return;
    }

    handledRef.current = true;
    navigate(pendingReturnTo, { replace: true });
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return null;
};

export default AuthRedirectHandler;
