// Chakra imports
import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import DashboardTableRow from "components/Tables/DashboardTableRow";
import React from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

const Projects = ({ title, amount, captions, data }) => {
  const textColor =  "white"
  let mainTeal =  "teal.300"
  let inputBg =  "gray.800"
  let mainText =  "gray.200"
  let navbarIcon =  "gray.200"
  let searchIcon =  "gray.200"

  return (
    <Card p='16px' overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='12px 0px 28px 0px'>
        <Flex
          pe={{ sm: "0px", md: "16px" }}
          w={{ sm: "100%", md: "100%" }}
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row" >

          <Text fontSize='lg' color={textColor} fontWeight='bold' pb='.5rem'>
            {title}
          </Text>
          <Flex
            pe={{ sm: "0px", md: "16px" }}
            w={{ sm: "50%", md: "50%" }}
            alignItems="end"
            justifyContent="flex-end"
            flexDirection="row" >
            <InputGroup

              cursor="pointer"
              borderRadius="15px"
              w={{
                sm: "200px",
                md: "400px",
              }}
              me={{ sm: "auto", md: "20px" }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
            >
              <InputLeftElement
                children={
                  <IconButton
                    bg="inherit"
                    borderRadius="inherit"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                    icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
                  ></IconButton>
                }
              />
              <Input
                fontSize="xs"
                py="11px"
                color={mainText}
                placeholder="Search projects..."
                borderRadius="inherit"
              />
            </InputGroup>

          </Flex>

        </Flex>

      </CardHeader>
      <Table variant='simple' color={textColor}>
        <Thead>
          <Tr my='.8rem' ps='0px'>
            {captions.map((caption, idx) => {
              return (
                <Th color='gray.400' key={idx} ps={idx === 0 ? "0px" : null}>
                  {caption}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => {
            return (
              <DashboardTableRow
                key={row.name}
                name={row.name}
                description={row.description}
                members={row.members}
                budget={row.budget}
                progression={row.progression}
              />
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
};

export default Projects;
