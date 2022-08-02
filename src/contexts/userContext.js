import { createContext, ReactNode, useContext, useState } from "react";

//import { addrToPubKeyHash, signTx } from "../wallet/utils";

//import { API } from "../contexts/WalletContext";
import { useToast } from "@chakra-ui/react";


export const UserContext_ = createContext({});

export function UserContextProvider({ children }) {
  const toast = useToast();

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

      if (user !== null) return user.isSignedIn;
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
    const user = getUser();

    if (user === null) return Promise.reject("No user registered!");
    else if (email !== user.email || password !== user.password)
      return Promise.reject("Incorrect email or password");
    else {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, isSignedIn: true })
      );
    }
  }

  function logout() {
    const user = getUser();

    if (user !== null)
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, isSignedIn: false })
      );
  }

  function applyJob(id) {
    const user = getUser();

    if (user === null) return;

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        jobs: [...user.jobs, { id, status: "Progress" }],
        notifications: [
          {
            type: "job-application-accepted",
            payload: {
              id: id,
            },
          },
          ...user.notifications,
        ],
      })
    );

    toast({
      title: "New notification",
      description:
        "Good news! Your job application was accepted! Access your profile on the top-right corner to view it!",
      status: "success",
      duration: null,
      isClosable: true,
    });
  }

  function addDispute(id) {
    const user = getUser();

    if (user === null) return;

    // TODO
    const indexOfProject = user.jobs.findIndex((job) => {
      return job.id === id;
    });

    user.jobs[indexOfProject].status = "Dispute";

    // Disputes should have two status [Progress, Resolved]
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        disputes: [...user.disputes, { id, status: "Progress" }],
        notifications: [
          {
            type: "deliverable-contested-dispute",
            payload: {
              id: id,
            },
          },
          ...user.notifications,
        ],
      })
    );
  }

  function resolveDispute(id) {
    const user = getUser();

    if (user === null) return;

    const indexOfDispute = user.disputes.findIndex((dispute) => {
      return dispute.id === id;
    });

    user.disputes[indexOfDispute].status = "Resolved";

    const indexOfJob = user.jobs.findIndex((job) => {
      return job.id === id;
    });

    user.jobs[indexOfJob].status = "Finished";

    // Disputes should have two status [Progress, Resolved]
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        notifications: [
          {
            type: "dispute-resolved",
            payload: {
              id: id,
            },
          },
          ...user.notifications,
        ],
      })
    );

    toast({
      title: "New notification",
      description:
        "Good news! The mediators declared your innocent! Access your profile on the top-right corner to claim the payment for your project!",
      status: "success",
      duration: null,
      isClosable: true,
    });
  }

  function submitWork(id) {
    const user = getUser();

    if (user === null) return;

    addDispute(id);

    toast({
      title: "New notification",
      description:
        "Oh no! The customer is contesting your work! But don't worry, the mediators will analyze the case. Access your profile on the top-right corner for more information!",
      status: "error",
      duration: null,
      isClosable: true,
    });
  }

  return (
    <UserContext_.Provider
      value={{
        isSignedIn,
        getUser,
        register: register,
        login: login,
        logout: logout,
        applyJob,
        submitWork,
        addDispute,
        resolveDispute,
      }}
    >
      {children}
    </UserContext_.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext_);
};
