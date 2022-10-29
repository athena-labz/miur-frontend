import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "contexts/userContext";
import { WalletContextProvider } from "contexts/walletContext";
import { TransactionContextProvider } from "contexts/transactionContext";
import App from "app";

ReactDOM.render(
  <WalletContextProvider>
    <UserContextProvider>
      <TransactionContextProvider>
        <App />
      </TransactionContextProvider>
    </UserContextProvider>
  </WalletContextProvider>,
  document.getElementById("root")
);
