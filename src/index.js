import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "contexts/userContext";
import App from "app";

ReactDOM.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>,
  document.getElementById("root")
);
