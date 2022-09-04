import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "contexts/userContext";
import { WalletContextProvider } from "contexts/walletContext";
import App from "app";

ReactDOM.render(
  <WalletContextProvider>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </WalletContextProvider>,
  document.getElementById("root")
);
