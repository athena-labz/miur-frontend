import React, { useEffect } from "react";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  BrowserRouter,
} from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { useContext } from "react";
import { UserContext_ } from "contexts/userContext";
import { useWallet } from "contexts/walletContext";

export default function App() {
  const { isSignedIn, user } = useContext(UserContext_);

  return (
    <BrowserRouter>
      <Switch>
        {!isSignedIn() && !user.isSignedIn ? (
          <>
            <Route path={`/auth`} component={AuthLayout} />
            <Redirect from={`/`} to="/auth/signin" />
          </>
        ) : (
          <>
            <Route path={`/admin`} component={AdminLayout} />

            {window.location.pathname === "/auth/signin" && (
              <Redirect from={`/`} to="/admin/dashboard" />
            )}
            {window.location.pathname === "/" && (
              <Redirect from={`/`} to="/admin/dashboard" />
            )}
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}
