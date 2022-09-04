import {
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

function truncate(input, length) {
  if (input.length > length) {
    return input.substring(0, length) + "...";
  }
  return input;
}

function DashboardTableRow(props) {
  const { projectKey, name, description, members, budget } = props;
  const textColor = "white";

  return (
    <Tr>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {name}
          </Text>
        </Flex>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} minWidth="100%">
          {truncate(description, 80)}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {members.length}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget}
        </Text>
      </Td>

      <Td>
        <Button
          variant="outline"
          colorScheme="teal"
          minW="110px"
          h="36px"
          fontSize="xs"
          px="1.5rem"
        >
          VIEW PROJECT
        </Button>
      </Td>
    </Tr>
  );
}

export default DashboardTableRow;
