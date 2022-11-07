// React
import { useState } from "react";

// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectCard from "./ProjectCard";

import { useHistory } from "react-router-dom";

const Projects = ({ axios, title, description }) => {
  // Chakra color mode
  const textColor = "white"

  // Projects
  const [projects, setProjects] = useState(null);

  const history = useHistory();

  useState(() => {
    (async () => {
      const res = await axios.get("/projects");
      console.log("projects", res)

      setProjects(res.data.projects);
    })()
  }, [])

  return (
    <Card p='16px' my='24px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Flex direction='column'>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            {title}
          </Text>
          <Text fontSize='sm' color='gray.500' fontWeight='400'>
            {description}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody px='5px'>
        <Grid
          templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }}
          templateRows={{ sm: "1fr 1fr 1fr auto", md: "1fr 1fr", xl: "1fr" }}
          gap='24px'>
          {projects ? projects.map((project, idx) => (
            <ProjectCard
              key={`project-card-${idx}`}
              projectId={project.project_id}
              name={project.name}
              description={project.short_description}
            />
          )) : "Loading Projects"}
          <Button
            p='0px'
            bg='transparent'
            color='gray.500'
            border='1px solid lightgray'
            borderRadius='15px'
            minHeight={{ sm: "200px", md: "100%" }}
            onClick={() => { history.push("/admin/projects/create-project") }}>
            <Flex direction='column' justifyContent='center' align='center'>
              <Icon as={FaPlus} fontSize='lg' mb='12px' />
              <Text fontSize='lg' fontWeight='bold'>
                Create a New Project
              </Text>
            </Flex>
          </Button>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default Projects;
