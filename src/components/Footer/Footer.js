/*eslint-disable*/
import React from "react";
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function Footer(props) {
  // const linkTeal =  "red.200"
  return (
    <Flex
      flexDirection={{
        base: "row",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "end",
      }}
      justifyContent="end"
      px="30px"
      pb="20px"
    >
      <Text
        color="gray.400"
        textAlign={{
          base: "center",
          xl: "end",
        }}
        mb={{ base: "20px", xl: "0px" }}
      >
        &copy; {1900 + new Date().getYear()},{" "}
        <Text as="span">
          {"Made with ❤️ by "}
        </Text>
        <Link
          // color={linkTeal}
          color="teal.400"
          href="https://www.creative-tim.com"
          target="_blank"
        >
          {"Athena Team"}
        </Link>

      </Text>

    </Flex>
  );
}
