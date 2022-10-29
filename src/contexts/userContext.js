import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useToast } from "@chakra-ui/react";

import { C } from "lucid-cardano";
import { Buffer } from "buffer";

const SIGNATURE_TIMEOUT = parseInt(process.env.REACT_APP_SIGNATURE_TIMEOUT);

export const UserContext_ = createContext({});

export function UserContextProvider({ children }) {
  const toast = useToast();

  const [user, setUser] = useState({isSignedIn: false});

  useEffect(() => {
    setUser(getUser());
  }, []);

  function getUser() {
    const user = localStorage.getItem("user");

    if (user === null) return null;
    else {
      console.log(JSON.parse(user));
      return JSON.parse(user);
    }
  }

  function updateUser(
    address,
    email,
    signature,
    timestamp,
    isSignedIn
  ) {
    const user = {
      address,
      email,
      signature,
      timestamp,
      isSignedIn,
    };

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function isSignedIn() {
    if (typeof window !== "undefined") {
      const user = getUser();

      if (user !== null && user.isSignedIn) return user.isSignedIn;
    }

    return false;
  }

  function hasSignatureExpired(signatureTimestamp) {
    // Get current timestamp
    const timestamp = Math.floor(new Date().getTime() / 1000);

    return timestamp - signatureTimestamp > SIGNATURE_TIMEOUT;
  }

  async function makeSignatureProof(api) {
    const addr = C.Address.from_bytes(
      Buffer.from(await api.getChangeAddress(), "hex")
    ).to_bech32();

    // Get current timestamp
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const signatureMessage = `Athena MIUR | ${timestamp}`;

    const paymentAddress = await api.getChangeAddress();
    const signature = await api.signData(
      paymentAddress,
      Buffer.from(signatureMessage).toString("hex")
    );

    return { signature, timestamp, address: addr };
  }

  async function signIn(axios, api) {
    const user = getUser();

    if (user === null) {
      try {
        const address = C.Address.from_bytes(
          Buffer.from(await api.getChangeAddress(), "hex")
        ).to_bech32();

        const response = await axios.get(`/user/${address}`);
        const { email } = response.data;

        const { signature, timestamp } = await makeSignatureProof(api);

        updateUser(address, email, signature, timestamp, true);

        return true;
      } catch (error) {
        console.dir(error);
        if (error.response.data.code === "address-not-found") return false;
        return Promise.reject(error);
      }
    }

    if (hasSignatureExpired(user.signatureTimestamp)) {
      const { signature, timestamp, address } = await makeSignatureProof(api);

      updateUser(
        address,
        user.nickname,
        user.email,
        signature,
        timestamp,
        true
      );
    }

    return true;
  }

  // async function fundProject ()

  async function signUp(axios, api, email) {
    // Check if we already have a saved user in ls with this address
    //   If we do, check if the signature has expired yet
    //     If it has,
    //       request new signature
    //       update user info, mark it as signed in and return success
    //     If it hasn't, mark it as signed in and return success
    //   If we don't,
    //     Request signature from user and try to register
    //     If it returns a 400 address-exists code,
    //       mark it as signed in and return success
    //     Else if it returns 200 code,
    //       mark it as signed in and return success
    //     Else (probably 400 email-exists code),
    //       warn user about it return success false

    const { signature, timestamp, address } = await makeSignatureProof(api);

    try {
      await axios.post(`/register/${address}`, {
        signature: signature,
        email: email,
      });

      updateUser(address, email, signature, timestamp, true);

      return;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <UserContext_.Provider
      value={{
        isSignedIn,
        user,
        signIn,
        signUp,
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
