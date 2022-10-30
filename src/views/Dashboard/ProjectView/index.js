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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
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

function ProjectView() {
  const { user, getUser } = useUser();
  const { curWallet, connect } = useWallet();

  const history = useHistory();
  const params = useParams();

  // Chakra color mode
  const textColor = "white";
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const [project, setProject] = useState(null);
  const [infoContent, setInfoContent] = useState(null);
  const [pathAfterInfo, setPathAfterInfo] = useState(null);
  const [openWalletSelector, setOpenWalletSelector] = useState(false);
  const [showFund, setShowFund] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await baseAxios.get(`/projects/${params.project_id}`);
        console.log("response", res);

        // setProject(res.data.project);
        setProject({
          name: res.data.project.name,
          creatorAddress: res.data.project.creator.address,
          shortDescription: res.data.project.short_description,
          longDescription: res.data.project.long_description,
          subjects: res.data.project.subjects,
          mediators: res.data.project.mediators,
          daysToComplete: res.data.project.days_to_complete,
          deliverables: res.data.project.deliverables,
        });
      } catch (error) {
        console.dir(error);
        if ("response" in error && error.response.status === 404) {
          setPathAfterInfo("/admin/dashboard");
          setInfoContent({
            header: "Error",
            body: `Project ID ${params.project_id} not found`,
          });
        }
      }
    })();

    (async () => {
      try {
        const res = await baseAxios.get(
          `/projects/${params.project_id}/${getUser().address}`
        );
        console.log("project user response", res);

        if (!res.data.creator && !res.data.funder) {
          setShowFund(true);
        }
      } catch (error) {
        console.dir(error);
      }
    })();
  }, []);

  async function fundProject(api, projectKey) {
    console.log("api", api);
    const changeAddress = C.Address.from_bytes(
      Buffer.from(await api.getChangeAddress(), "hex")
    ).to_bech32();

    const utxos = await api.getUtxos();

    const res = await baseAxios.post(`/projects/${projectKey}/fund`, {
      utxos: utxos,
      change_address: changeAddress,
      fallback_policy:
        "65783e84e04af28ecb157abc4d18bb12728d2326c5afd69302077de9",
    });

    const txCbor = res.data.transaction_cbor;

    const witness = await api.signTx(txCbor);
    console.log(txCbor);
    console.log("=======================");
    console.log(witness);
  }

  function truncate(input, length) {
    if (input.length > length) {
      return input.substring(0, length) + "...";
    }
    return input;
  }

  return (
    <>
      {project === null ? (
        <>Loading</>
      ) : (
        <>
          <Flex
            align={"center"}
            direction="column"
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            <Stack
              spacing={4}
              w={"100%"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <Grid
                templateColumns={{ sm: "1fr", xl: "repeat(2, 1fr)" }}
                gap="22px"
              >
                <Card p="16px" my={{ sm: "24px", xl: "0px" }}>
                  <CardHeader p="12px 5px" mb="12px">
                    <Text fontSize="lg" color={textColor} fontWeight="bold">
                      {project.name}
                    </Text>
                  </CardHeader>
                  <CardBody px="5px">
                    <Flex direction="column">
                      <Text
                        fontSize="md"
                        color="gray.500"
                        fontWeight="400"
                        mb="30px"
                      >
                        {project.longDescription}
                      </Text>
                      <Flex align="center" mb="18px">
                        <Text
                          fontSize="md"
                          color={textColor}
                          fontWeight="bold"
                          me="10px"
                        >
                          Creator Address:{" "}
                        </Text>
                        <Tooltip label={project.creatorAddress}>
                          <Text
                            fontSize="md"
                            color="gray.500"
                            fontWeight="400"
                            me="10px"
                          >
                            {truncate(project.creatorAddress, 15)}
                          </Text>
                        </Tooltip>
                        <Button
                          p="0px"
                          bg="transparent"
                          variant="no-hover"
                          onClick={() =>
                            window.prompt(
                              "Copy to clipboard: Ctrl+C, Enter",
                              project.creatorAddress
                            )
                          }
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="teal.300"
                            alignSelf="center"
                          >
                            COPY
                          </Text>
                        </Button>
                      </Flex>
                      {/* <Flex align="center" mb="18px"> */}
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        me="10px"
                      >
                        Days to complete:{" "}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {project.daysToComplete}
                      </Text>
                      {/* </Flex> */}
                    </Flex>
                  </CardBody>
                </Card>

                <div>
                  <Card p="16px">
                    <CardHeader p="12px 5px" mb="12px">
                      <Text fontSize="lg" color={textColor} fontWeight="bold">
                        Subjects
                      </Text>
                    </CardHeader>
                    <CardBody px="5px">
                      <Flex direction="column" w="100%">
                        <UnorderedList>
                          {project.subjects.map((subject, idx) => (
                            <ListItem key={`subject#${idx}#${subject}`}>
                              <Text
                                fontSize="md"
                                color="gray.500"
                                fontWeight="400"
                                me="10px"
                              >
                                {subject}
                              </Text>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Flex>
                    </CardBody>
                  </Card>

                  <Card p="16px">
                    <CardHeader p="12px 5px" mb="12px">
                      <Text fontSize="lg" color={textColor} fontWeight="bold">
                        Deliverables
                      </Text>
                    </CardHeader>
                    <CardBody px="5px">
                      <Flex direction="column" w="100%">
                        <UnorderedList>
                          {project.deliverables.map((deliverable, idx) => (
                            <ListItem key={`deliverable#${idx}#${deliverable}`}>
                              <Text
                                fontSize="md"
                                color="gray.500"
                                fontWeight="400"
                                me="10px"
                              >
                                {deliverable}
                              </Text>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Flex>
                    </CardBody>
                  </Card>
                </div>
              </Grid>
              <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
                {/* <Button
                  bg={"red.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "red.500",
                  }}
                >
                  Raise Accusation
                </Button> */}

                {showFund ? (
                  <Funder
                    axios={baseAxios}
                    fundingAmount={10_000_000}
                    projectId={params.project_id}
                  />
                ) : (
                  <></>
                )}
              </Stack>
            </Stack>
          </Flex>
          <WalletSelector
            isOpen={openWalletSelector}
            onSelect={async (wallet) => {
              connect(wallet)
                .then(async (result) => {
                  if (result.success === true) {
                    fundProject(result.api, params.project_id);
                  } else {
                    console.error("Wallet failed while trying to connect!");
                    console.error(result.error);
                  }

                  setOpenWalletSelector(false);
                })
                .catch((err) => {
                  console.error(err);
                  console.error("Wallet refused to connect!");
                  setOpenWalletSelector(false);
                });
            }}
            onClose={() => setOpenWalletSelector(false)}
          />
        </>
      )}
      <Info
        isOpen={infoContent !== null}
        onClose={() => {
          setInfoContent(null);
          if (pathAfterInfo !== null) history.push(pathAfterInfo);
        }}
        header={infoContent?.header}
        body={infoContent?.body}
      />
    </>
  );
}
export default ProjectView;
