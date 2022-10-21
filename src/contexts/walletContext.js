import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { createNoSubstitutionTemplateLiteral } from "typescript";

import WALLET_DATA from "../data/Wallet";

const WALLETS = WALLET_DATA.wallets; // null to accept any wallets

export const WalletContext_ = createContext({});

export function WalletContextProvider({ children }) {
  const [curWallet, setCurWallet] = useState(null);

  const getWallets = () => {
    if (typeof window !== "undefined" && window.cardano) {
      let wallets = {};

      for (const [key, value] of Object.entries(WALLETS)) {
        if (key in window.cardano)
          wallets[key] = { ...window.cardano[key], ...value, installed: true };
        else wallets[key] = { ...value, installed: false };
      }
      return wallets;
    } else return {};
  };

  const connect = async (name) => {
    const wallets = getWallets();

    if (name in wallets && wallets[name].installed) {
      const wallet = wallets[name];
      const api = await wallet.enable();

      setCurWallet(api);
      return Promise.resolve({ success: true, api });
    } else if (name in wallets && !wallets[name].installed) {
      window.open(wallets[name].store);
      return Promise.resolve({
        success: false,
        message: "Wallet not installed",
      });
    } else {
      return Promise.reject("Unknown wallet index");
    }
  };

  return (
    <WalletContext_.Provider
      value={{
        getWallets,
        curWallet,
        connect,
      }}
    >
      {children}
    </WalletContext_.Provider>
  );
}

export const useWallet = () => {
  return useContext(WalletContext_);
};
