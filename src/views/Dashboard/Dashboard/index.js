// Chakra imports
import { Flex, Button } from "@chakra-ui/react";
// assets
import { Link } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { dashboardTableData, timelineData } from "variables/general";
import Projects from "./components/Projects";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default function Dashboard() {
  const iconBoxInside = "white";

  const [projects, setProjects] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await baseAxios.get("/projects");
      console.log("response to endpoint /projects", res)

      setProjects(
        res.data.projects.map((project) => {
          return {
            projectKey: project.project_id,
            name: project.name,
            description: project.short_description,
            funders: project.funders,
            members: [],
            budget: project.reward_requested,
          };
        })
      );
    })();
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <Flex
        pe={{ sm: "0px", md: "16px" }}
        w={{ sm: "50%", md: "100%" }}
        alignItems="end"
        justifyContent="flex-end"
        flexDirection="row"
      >
        <Button
          bg="teal.300"
          w="30%"
          p="8px 32px"
          mb={5}
          _hover="teal.300"
          color="white"
          fontSize="md"
          as={Link}
          href="projects/create-project"
        >
          CREATE A NEW PROJECT
        </Button>
      </Flex>
      {projects !== null ? (
        <Projects
          title={"Projects"}
          amount={30}
          captions={[
            "Projects Name",
            "Description",
            "Funders",
            "Required Rewards",
          ]}
          data={projects}
        />
      ) : (
        <Projects
          title={"Projects"}
          amount={30}
          captions={[]}
          data={[]}
        />
      )}
    </Flex>
  );
}
