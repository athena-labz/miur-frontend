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
import { Info } from "components/Info";

import { useUser } from "../../../contexts/userContext";

import { useHistory } from "react-router-dom";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function CreateProject() {
  const { user } = useUser();
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

  useEffect(() => {
    (async () => {
      try {
        const res = await baseAxios.get(`/projects/${params.project_id}`);
        console.log("response", res);

        // setProject(res.data.project);
        setProject({
          name: res.data.project.name,
          creatorAddress: res.data.project.creator_address,
          shortDescription: res.data.project.short_description,
          longDescription:res.data.project.long_description,
          subjects: res.data.project.subjects,
          rewardRequested: res.data.project.reward_requested,
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

  // const project = {
  //   name: "Very Interesting Project",
  //   creatorAddress:
  //     "addr_test1qrnr8feaawltx4200zpq48jg2ts7pgq9lqfpnrlprtge7lmkrezryq3ydtmkg0e7e2jvzg443h0ffzfwd09wpcxy2fuqawn2un",
  //   shortDescription:
  //     "Ad quisquam debitis saepe asperiores atque nulla et. Repudiandae modi consequatur consectetur ratione molestiae quam. Nam sit earum eveniet et eum.nteresting Project",
  //   longDescription:
  //     "Ipsam nam et voluptatem nihil omnis. Cupiditate officia est non consectetur odio assumenda. Occaecatiet et delectus rerum porro et ab. Aut maxime aliquam harum harum ipsa rerum numquam. Et enim dolores ab sit et suscipit.\nArchitecto minima quia rem ea. At totam quia non placeat. Enim eum vel aliquam impedit placeat. Dicta non ipsam voluptatem rerum consequatur sed voluptatem. Veritatis praesentium officiis in facilis.\nAd quisquam debitis saepe asperiores atque nulla et. Repudiandae modi consequatur consectetur ratione molestiae quam. Nam sit earum eveniet et eum.\nDebitis quis blanditiis et. Modi et rerum amet pariatur modi consequatur. Porro cumque consequuntur exercitationem quia placeat aut ut. Praesentium est autem et consequuntur laudantium eum. Quod enim omnis molestiae nihil cum aut omnis officia. Amet harum est odio nobis dolores iure.\nQuia expedita dolorum quis ut. Laborum sit nihil fugiat aperiam suscipit voluptatem. Nesciunt accusantium adipisci ut odit aut. Nisi est doloremque quasi harum quod. Facere eveniet inventore quidem alias pariatur ea. Autem necessitatibus ut fuga enim.",
  //   subjects: ["Math", "Physics", "Turism", "Programming"],
  //   rewardRequested: 50_000,
  //   daysToComplete: 30,
  //   deliverables: ["I will do X", "Y is going to be done", "Gonna complete Z"],
  // };

  function truncate(input, length) {
    if (input.length > length) {
      return input.substring(0, length) + "...";
    }
    return input;
  }

  useEffect(() => {
    console.log("beep");
    console.log(params.project_id);
  }, []);

  return (
    <>
      {project === null ? (
        <>Loading</>
      ) : (
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
                    <Flex align="center" mb="18px">
                      <Text
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        me="10px"
                        toolt
                      >
                        Rewards Requested:{" "}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {project.rewardRequested} RE
                      </Text>
                    </Flex>
                    <Flex align="center" mb="18px">
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
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Raise Accusation
              </Button>

              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => console.log("funding project!")}
              >
                Fund Project
              </Button>
            </Stack>
          </Stack>
        </Flex>
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
export default CreateProject;
