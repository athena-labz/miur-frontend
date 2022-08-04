import { createContext, ReactNode, useContext, useState } from "react";

//import { addrToPubKeyHash, signTx } from "../wallet/utils";

//import { API } from "../contexts/WalletContext";
import { useToast } from "@chakra-ui/react";


export const UserContext_ = createContext({});
const mock_users = [
  {
    email: "aaaa",
    password: "aaaa"
  },
  {
    email: "aaaa2",
    password: "aaaa"
  },
  {
    email: "aaaa3",
    password: "aaaa"
  },
]

export function UserContextProvider({ children }) {
  const toast = useToast();

  const [user, setUser] = useState({ isSignedIn: false });

  function getUser() {
    const user = localStorage.getItem("user");

    if (user === null) return null;
    else {
      console.log(JSON.parse(user));
      return JSON.parse(user);
    }
  }

  function isSignedIn() {
    if (typeof window !== "undefined") {
      const user = getUser();

      if (user !== null && user.isSignedIn) return user.isSignedIn;
    }

    return false;
  }

  async function register(
    role,
    name,
    email,
    address,
    password
  ) {
    const user = {
      name,
      email,
      role,
      address,
      password,
      pubkeyhash: addrToPubKeyHash(address),
      isSignedIn: true,
      jobs: [],
      disputes: [],
      notifications: [],
    };

    localStorage.setItem("user", JSON.stringify(user));
  }

  async function login(email, password) {
    let user_ = mock_users.find(user => user.email === email && user.password === password)

    if (Boolean(user_)) {
      setUser({ ...user_, isSignedIn: true })
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user_, isSignedIn: true })
      );
      return true
    }

    return false
  }
  function logout() {
    const user = getUser();

    if (user !== null) {
      setUser(null)
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, isSignedIn: false })
      );
      document.location.reload(true);
    }

  }


  return (
    <UserContext_.Provider
      value={{
        isSignedIn,
        user,
        register: register,
        login,
        logout,
      }}
    >
      {children}
    </UserContext_.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext_);
};
