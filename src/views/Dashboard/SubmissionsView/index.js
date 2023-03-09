// Chakra imports
import {
  Flex,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  UnorderedList,
  ListItem,
  Grid,
  Button,
  Stack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import MultiSelectMenu from "components/MultipleSelect";
import { WalletSelector } from "components/WalletSelector";
import { Info } from "components/Info";
import { Funder } from "components/Funder";

import { useUser } from "../../../contexts/userContext";
import { useWallet } from "../../../contexts/walletContext";

import { useHistory } from "react-router-dom";

import { C } from "lucid-cardano";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SubmissionsView() {
  const { user } = useUser();
  const { curWallet, connect } = useWallet();

  const history = useHistory();
  const params = useParams();

  // Chakra color mode
  const textColor = "white";
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const [submissions, setSubmissions] = useState(null);

  const updateSubmissions = async () => {
    try {
      const res = await baseAxios.get(`/submissions/${params.project_id}`);

      setSubmissions(res.data.submissions);

      console.log("submissions", res.data.submissions);
    } catch (error) {
      console.dir(error);
    }
  };

  useEffect(() => {
    updateSubmissions();
  }, []);

  return (
    <>
      {submissions === null ? (
        <>Loading</>
      ) : (
        <>
          <Button
            variant="outline"
            colorScheme="teal"
            minW="110px"
            h="36px"
            fontSize="xs"
            px="1.5rem"
            onClick={() => history.push(`/admin/projects/${params.project_id}`)}
          >
            Get back to projects
          </Button>
          <Flex
            align={"center"}
            direction="column"
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            {submissions.length === 0 && (
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                No submissions yet
              </Text>
            )}
            {submissions.map((submission) => (
              <Card p="16px" my="24px">
                <CardHeader p="12px 5px" mb="12px">
                  <Text fontSize="lg" color={textColor} fontWeight="bold">
                    {submission.name}
                  </Text>
                </CardHeader>
                <CardBody px="5px">
                  <Text
                    fontSize="md"
                    color="gray.500"
                    fontWeight="400"
                    mb="30px"
                  >
                    {submission.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Flex>
        </>
      )}
      {/* <Info
        isOpen={infoContent !== null}
        onClose={() => {
          setInfoContent(null);
          if (pathAfterInfo !== null) history.push(pathAfterInfo);
        }}
        header={infoContent?.header}
        body={infoContent?.body}
      /> */}
    </>
  );
}
export default SubmissionsView;
