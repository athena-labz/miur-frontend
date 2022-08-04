import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { useContext } from 'react';
import { UserContext_ } from "contexts/userContext";

export default function App() {
    const { isSignedIn } = useContext(UserContext_);

    return (
        <HashRouter>
            <Switch>
                {
                    !isSignedIn() ? (
                        <>
                            <Route path={`/auth`} component={AuthLayout} />
                            <Redirect from={`/`} to="/auth/signin" />
                        </>
                    ) : (
                        <>
                            <Route path={`/admin`} component={AdminLayout} />
                            <Redirect from={`/`} to="/admin/dashboard" />
                        </>
                    )
                }
            </Switch>
        </HashRouter>
    )
}
