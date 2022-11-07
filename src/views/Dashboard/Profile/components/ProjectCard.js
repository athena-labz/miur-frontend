// Chakra imports
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

import { useHistory } from "react-router-dom";

const ProjectCard = ({ projectId, name, description }) => {
  // Chakra color mode
  const textColor =  "white"

  const history = useHistory();

  return (
    <Flex direction='column'>
      <Flex direction='column'>
        <Text fontSize='md' color='gray.300' fontWeight='600' mb='10px'>
          {name}
        </Text>
        <Text fontSize='md' color='gray.500' fontWeight='400' mb='20px'>
          {description}
        </Text>
        <Flex justifyContent='space-between'>
          <Button
            variant='outline'
            colorScheme='teal'
            minW='110px'
            h='36px'
            fontSize='xs'
            px='1.5rem'
            onClick={() => {history.push(`/admin/projects/${projectId}`)}}
          >
            VIEW PROJECT
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectCard;
