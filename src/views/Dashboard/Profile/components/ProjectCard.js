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

const ProjectCard = ({ image, name, avatars, description }) => {
  // Chakra color mode
  const textColor =  "white"

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
            px='1.5rem'>
            VIEW PROJECT
          </Button>
          <AvatarGroup size='xs'>
            {avatars.map((el, idx) => {
              return <Avatar src={el} key={idx} />;
            })}
          </AvatarGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectCard;
