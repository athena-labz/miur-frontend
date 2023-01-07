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

  const [user, setUser] = useState({ isSignedIn: false });

  useEffect(() => {
    setUser(getUser());
  }, []);

  async function getStakeAddress(api) {
    return C.Address.from_bytes(
      Buffer.from((await api.getRewardAddresses())[0], "hex")
    ).to_bech32();
  }

  function getUser() {
    const user = localStorage.getItem("user");

    if (user === null) return null;
    else {
      console.log(JSON.parse(user));
      return JSON.parse(user);
    }
  }

  function updateUser(
    stakeAddress,
    paymentAddress,
    email,
    signature,
    timestamp,
    isSignedIn
  ) {
    const user = {
      stakeAddress,
      paymentAddress,
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
    const stakeAddress = (await api.getRewardAddresses())[0];

    const paymentAddress = C.Address.from_bytes(
      Buffer.from(await api.getChangeAddress(), "hex")
    ).to_bech32();

    // Get current timestamp
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const signatureMessage = `Athena MIUR | ${timestamp}`;

    const signature = await api.signData(
      stakeAddress,
      Buffer.from(signatureMessage).toString("hex")
    );

    return {
      signature, timestamp, paymentAddress, stakeAddress: C.Address.from_bytes(
        Buffer.from(stakeAddress, 'hex')
      ).to_bech32()
    };
  }

  async function signIn(axios, api) {
    const user = getUser();

    if (user === null) {
      try {
        const stakeAddress = C.Address.from_bytes(
          Buffer.from((await api.getRewardAddresses())[0], "hex")
        ).to_bech32();

        const response = await axios.get(`/user/${stakeAddress}`);
        const { email } = response.data;

        const { signature, timestamp, paymentAddress } = await makeSignatureProof(api);

        updateUser(stakeAddress, paymentAddress, email, signature, timestamp, true);

        return true;
      } catch (error) {
        console.dir(error);
        if (error.response.data.code === "address-not-found") return false;
        return Promise.reject(error);
      }
    } else if (hasSignatureExpired(user.signatureTimestamp)) {
      const { signature, timestamp, stakeAddress, paymentAddress } = await makeSignatureProof(api);

      updateUser(
        stakeAddress,
        paymentAddress,
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

    const { signature, timestamp, stakeAddress, paymentAddress } = await makeSignatureProof(api);

    console.log("Wow that's incredible", { signature, timestamp, stakeAddress, paymentAddress })
    try {
      await axios.post(`/register/${stakeAddress}`, {
        signature,
        email,
        payment_address: paymentAddress
      });

      updateUser(stakeAddress, paymentAddress, email, signature, timestamp, true);

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
        getUser,
        signIn,
        signUp,
        logout,
        getStakeAddress
      }}
    >
      {children}
    </UserContext_.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext_);
};
