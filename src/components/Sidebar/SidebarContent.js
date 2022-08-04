/*eslint-disable*/
// chakra imports
import {
  Box,
  Button, Flex,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { Separator } from "components/Separator/Separator";
import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import { UserContext_ } from "contexts/userContext";

// this function creates the links and collapses that appear in the sidebar (left menu)


const SidebarContent = ({ logoText, routes }) => {
  const { logout} = useContext(UserContext_);

  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  const createLinks = (routes) => {
    // Chakra Color Mode
    const activeBg = "gray.700"
    const inactiveBg = "gray.700"
    const activeColor = "white"
    const inactiveColor = "gray.400"

    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "12px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}


          </div>
        );
      }
      return (
        prop.isLogout ?
          <Button 
            onClick={logout}
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            bg="transparent"
            mb={{
              xl: "12px",
            }}
            mx={{
              xl: "auto",
            }}
            py="12px"
            ps={{
              sm: "10px",
              xl: "16px",
            }}
            borderRadius="15px"
            _hover="none"
            w="100%"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            <Flex>
              {typeof prop.icon === "string" ? (
                <Icon>{prop.icon}</Icon>
              ) : (
                <IconBox
                  bg={inactiveBg}
                  color="teal.300"
                  h="30px"
                  w="30px"
                  me="12px"
                >
                  {prop.icon}
                </IconBox>
              )}
              <Text color={inactiveColor} my="auto" fontSize="sm">
                {document.documentElement.dir === "rtl"
                  ? prop.rtlName
                  : prop.name}
              </Text>
            </Flex>
          </Button> 
          :
          <NavLink to={prop.layout + prop.path} key={prop.name}>
            {activeRoute(prop.layout + prop.path) === "active" ? (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={activeBg}
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                py="12px"
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg="teal.300"
                      color="white"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={activeColor} my="auto" fontSize="sm">
                    {document.documentElement.dir === "rtl"
                      ? prop.rtlName
                      : prop.name}
                  </Text>
                </Flex>
              </Button>
            ) : (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg="transparent"
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                py="12px"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg={inactiveBg}
                      color="teal.300"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={inactiveColor} my="auto" fontSize="sm">
                    {document.documentElement.dir === "rtl"
                      ? prop.rtlName
                      : prop.name}
                  </Text>
                </Flex>
              </Button>
            )}
          </NavLink>
      );
    });
  };

  const links = <>{createLinks(routes)}</>;
  const { colorMode, toggleColorMode } = useColorMode()
  if (colorMode === "light") toggleColorMode()

  return (
    <>
      <Box pt={"25px"} mb="12px">
        <Link
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          <Image src="https://i.imgur.com/Ry1PZew.png" width="2rem" height="1.8rem" mr="0.8rem" />
          <Text fontSize="sm" mt="3px">
            {logoText}
          </Text>
        </Link>
        <Separator></Separator>
      </Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>

      </Stack>
    </>
  )
}

export default SidebarContent