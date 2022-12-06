import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "contexts/userContext";
import { WalletContextProvider } from "contexts/walletContext";
import { TransactionContextProvider } from "contexts/transactionContext";
import App from "app";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <WalletContextProvider>
    <UserContextProvider>
      <TransactionContextProvider>
        <ToastContainer />
        <App />
      </TransactionContextProvider>
    </UserContextProvider>
  </WalletContextProvider>,
  document.getElementById("root")
);
