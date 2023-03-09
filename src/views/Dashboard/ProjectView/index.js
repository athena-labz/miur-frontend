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
  const [showAlreadyFunded, setShowAlreadyFunded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await baseAxios.get(`/projects/${params.project_id}`);
        console.log("response", res);

        // setProject(res.data.project);
        setProject({
          name: res.data.project.name,
          creatorAddress: res.data.project.creator.stake_address,
          creatorPaymentAddress: res.data.project.creator.payment_address,
          creatorEmail: res.data.project.creator.email,
          shortDescription: res.data.project.short_description,
          longDescription: res.data.project.long_description,
          subjects: res.data.project.subjects,
          mediators: res.data.project.mediators,
          funders: res.data.project.funders,
          totalFundingAmount: res.data.project.total_funding_amount,
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
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const res = await baseAxios.get(
            `/projects/${params.project_id}/${user.stakeAddress}`
          );
          console.log("project user response", res);

          if (!res.data.creator && !res.data.funder) {
            setShowFund(true);
          }

          if (res.data.funder) {
            setShowAlreadyFunded(true);
          } else {
            setShowAlreadyFunded(false);
          }
        } catch (error) {
          console.dir(error);
        }
      })();
    }
  }, [user]);

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
          {project?.totalFundingAmount >= 1_000 && (
            <Tooltip
              aria-label="Project Funded"
              label="This project received more than 1,000 STEIN and was, therefore, funded."
              placement="top"
            >
              <Button bg={"green.600"} color={"white"} w="full">
                Funded
              </Button>
            </Tooltip>
          )}
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
                          Creator:{" "}
                        </Text>
                        <Text
                          fontSize="md"
                          color="gray.500"
                          fontWeight="400"
                          me="10px"
                        >
                          {project.creatorEmail}
                        </Text>
                      </Flex>
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

                <Button
                  variant="outline"
                  colorScheme="teal"
                  minW="110px"
                  h="36px"
                  fontSize="lg"
                  px="1.5rem"
                  onClick={() =>
                    history.push(
                      `/admin/projects/${params.project_id}/submissions`
                    )
                  }
                >
                  View Submissions
                </Button>
              </Grid>

              <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
                {showFund &&
                process.env.REACT_APP_BLOCK_FUND?.toLocaleLowerCase() !==
                  "true" ? (
                  <Funder
                    axios={baseAxios}
                    projectId={params.project_id}
                    fundeePaymentAddress={project.creatorPaymentAddress}
                  />
                ) : showAlreadyFunded ? (
                  <Button bg={"gray.600"} color={"white"} w="full">
                    Project Already Funded By You
                  </Button>
                ) : (
                  <></>
                )}
              </Stack>
            </Stack>

            <Stack
              spacing={4}
              w={"100%"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
                <CardHeader p="12px 0px 28px 0px">
                  <Flex
                    pe={{ sm: "0px", md: "16px" }}
                    w={{ sm: "100%", md: "100%" }}
                    alignItems="center"
                    justifyContent="space-between"
                    flexDirection="row"
                  >
                    <Text
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                      pb=".5rem"
                    >
                      Funding History
                    </Text>
                  </Flex>
                  {project?.totalFundingAmount ? (
                    <Flex
                      pe={{ sm: "0px", md: "16px" }}
                      w={{ sm: "50%", md: "50%" }}
                      alignItems="end"
                      justifyContent="flex-end"
                      flexDirection="row"
                    >
                      <Text
                        fontSize="lg"
                        color={textColor}
                        fontWeight="bold"
                        pb=".5rem"
                      >
                        Total:{" "}
                        {numberWithCommas(
                          project?.totalFundingAmount
                            ? project?.totalFundingAmount
                            : 0
                        )}{" "}
                        STEIN
                      </Text>
                    </Flex>
                  ) : (
                    <></>
                  )}
                </CardHeader>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" ps="0px">
                      <Th
                        color="gray.400"
                        key={"funder-table-header"}
                        ps={"0px"}
                      >
                        Funder
                      </Th>
                      <Th
                        color="gray.400"
                        key={"amount-table-header"}
                        ps={null}
                      >
                        Amount
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {project?.funders
                      .filter(({ status }) => status == "submitted")
                      .map(({ user: { email }, amount }) => {
                        return (
                          <Tr>
                            <Td pl="0px">
                              <Flex
                                align="center"
                                py=".8rem"
                                minWidth="100%"
                                flexWrap="nowrap"
                              >
                                <Text
                                  fontSize="md"
                                  color={textColor}
                                  fontWeight="bold"
                                  minWidth="100%"
                                >
                                  {email}
                                </Text>
                              </Flex>
                            </Td>

                            <Td>
                              <Flex
                                align="center"
                                py=".8rem"
                                minWidth="100%"
                                flexWrap="nowrap"
                              >
                                <Text
                                  fontSize="md"
                                  color={textColor}
                                  fontWeight="bold"
                                  minWidth="100%"
                                >
                                  {numberWithCommas(amount)} STEIN
                                </Text>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </Card>
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
