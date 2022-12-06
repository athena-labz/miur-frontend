import { useEffect, useState } from "react";

// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import AssignedQuizes from "./components/AssignedQuizes";

import axios from "axios";

import { useUser } from "../../../contexts/userContext";

function shortenAddress(address, cutFirst = 15, cutLast = 5) {
  if (address.length > length) {
    const firstPartAddress = address.slice(0, cutFirst);
    const lastPartAddress = address.slice(address.length - cutLast);

    return firstPartAddress + "..." + lastPartAddress;
  } else {
    return address;
  }
}

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function Profile() {
  const [ongoingQuizes, setOngoingQuizes] = useState(null);

  const { user } = useUser();

  // Chakra color mode
  const textColor = "white";
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  useEffect(() => {
    (async () => {
      if (user.stakeAddress) {
        const res = await baseAxios.get(`/user/${user.stakeAddress}/quiz`);
        console.log("response", res);
        setOngoingQuizes(res.data.ongoing_quiz_assignments);
      }
    })();
  }, [user]);

  return (
    <Flex direction="column">
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar4}
        address={
          user?.stakeAddress
            ? shortenAddress(user.stakeAddress)
            : "Failed to load user address"
        }
        email={user?.email ? user.email : "Failed to load user email"}
        tabs={[]}
      />
      {user?.stakeAddress ? (
        <>
          <Projects
            axios={baseAxios}
            title={"Created Projects"}
            description={"Crowdfunding projects created by you"}
            creator={user.stakeAddress}
          />
          <Projects
            axios={baseAxios}
            title={"Funded Projects"}
            description={"Crowdfunding projects being funded by you"}
            funder={user.stakeAddress}
          />
          <AssignedQuizes
            title={"Ongoing Quizes"}
            description={"Quizes that are currently in progress"}
            quizes={ongoingQuizes}
          />
        </>
      ) : (
        <>Loading</>
      )}
    </Flex>
  );
}

export default Profile;
