// Chakra imports
import {
  Flex,
  Button
} from "@chakra-ui/react";
// assets
import peopleImage from "assets/img/people-image.png";
import logoChakra from "assets/svg/logo-white.svg";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React from "react";
import { dashboardTableData, timelineData } from "variables/general";
import Projects from "./components/Projects";

export default function Dashboard() {
  const iconBoxInside = "white"

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <Flex
        pe={{ sm: "0px", md: "16px" }}
        w={{ sm: "50%", md: "100%" }}
        alignItems="end"
        justifyContent="flex-end"
        flexDirection="row" >

        <Button
          bg="teal.300"
          w="30%"
          p="8px 32px"
          mb={5}
          _hover="teal.300"
          color="white"
          fontSize="md"

        >
          CREATE A NEW PROJECT
        </Button>
      </Flex>
      <Projects
        title={"Campaings"}
        amount={30}
        captions={["Projects Names", "Apoiadores", "Budget", "Completion"]}
        data={dashboardTableData}
      />
    </Flex>
  );
}
