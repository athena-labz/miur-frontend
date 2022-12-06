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

const AssignedQuizCard = ({ quizId, name, creator }) => {
  // Chakra color mode
  const textColor = "white";

  const history = useHistory();

  return (
    <Flex direction="column">
      <Flex direction="column">
        <Text fontSize="md" color="gray.300" fontWeight="600" mb="10px">
          {name}
        </Text>
        <Text fontSize="md" color="gray.500" fontWeight="400" mb="20px">
          Created by <b>{creator}</b>
        </Text>
        <Flex justifyContent="space-between">
          <Button
            variant="outline"
            colorScheme="teal"
            minW="110px"
            h="36px"
            fontSize="xs"
            px="1.5rem"
            onClick={() => {
              history.push(`/admin/questions/${quizId}`);
            }}
          >
            CONTINUE QUIZ
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AssignedQuizCard;
