// Chakra imports
import { Flex, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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

import MultiSelectMenu from "components/MultipleSelect";
import { Info } from "components/Info";

import { useUser } from "../../../contexts/userContext";

import { useHistory } from "react-router-dom";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function padStr(i) {
  return i < 10 ? "0" + i : "" + i;
}

function currentDate() {
  var temp = new Date();
  var dateStr =
    padStr(temp.getFullYear()) +
    "-" +
    padStr(1 + temp.getMonth()) +
    "-" +
    padStr(temp.getDate());

  return dateStr;
}

function dateToTimestamp(dateStr) {
  const myDate = dateStr.split("-");
  const newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);

  return parseInt(newDate.getTime() / 1000);
}

function CreateProject() {
  const { user } = useUser();
  const history = useHistory();

  // Chakra color mode
  const textColor = "white";
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const options = ["Physics", "Math", "Turism", "Programming"];

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [rewardRequested, setRewardRequested] = useState(50_000);
  const [daysToComplete, setDaysToComplete] = useState(30);
  const [deliverables, setDeliverables] = useState([""]);
  const [startDate, setStartDate] = useState(currentDate());

  const [infoContent, setInfoContent] = useState(null);
  const [pathAfterInfo, setPathAfterInfo] = useState(null);

  function updateDeliverable(idx, deliverable) {
    let deliverablesCopy = [...deliverables];
    deliverablesCopy[idx] = deliverable;

    setDeliverables(deliverablesCopy);
  }

  async function createProject() {
    if (!user.isSignedIn) {
      console.error("Trying to create project for user who is not signed in!");

      setInfoContent({
        header: "Authentication Error",
        body: "User not signed in. It is possible that the signature expired.",
      });

      setPathAfterInfo("/auth");
    } else {
      try {
        await baseAxios.post("/projects/create", {
          signature: user.signature,
          name: title,
          creator: user.address,
          short_description: shortDescription,
          long_description: longDescription,
          subjects: subjects,
          days_to_complete: daysToComplete,
          deliverables: deliverables,
          mediators: [],
          start_date: dateToTimestamp(startDate)
        });

        setInfoContent({
          header: "Success",
          body: "Created project successfully",
        });

        setPathAfterInfo("/admin");
      } catch (error) {
        setInfoContent({
          header: "Create Project Error",
          body: error.response.data.message,
        });
      }
    }
  }

  return (
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
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Create a Project
          </Heading>

          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              _placeholder={{ color: "gray.500" }}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
            />
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel>Short Description</FormLabel>
            <Input
              _placeholder={{ color: "gray.500" }}
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </FormControl>

          <FormControl id="long_description" isRequired>
            <FormLabel> Long Description</FormLabel>
            <Textarea
              _placeholder={{ color: "gray.500" }}
              value={longDescription}
              onChange={(event) => setLongDescription(event.target.value)}
            />
          </FormControl>

          <FormControl id="long_description" isRequired>
            <FormLabel>Subjects</FormLabel>
            <MultiSelectMenu
              label="Selected Subjects"
              options={options}
              onChange={(subjects) => setSubjects(subjects)}
            />
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
            <FormControl id="days_to_complete" isRequired>
              <FormLabel>Days to complete</FormLabel>
              <Input
                type="number"
                placeholder="5 days"
                _placeholder={{ color: "gray.500" }}
                value={daysToComplete}
                onChange={(event) =>
                  setDaysToComplete(parseInt(event.target.value))
                }
              />
            </FormControl>
          </Stack>

          <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
            <FormControl id="start_date" isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                _placeholder={{ color: "gray.500" }}
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </FormControl>
          </Stack>

          <FormControl id="deliverables" isRequired>
            <FormLabel>Deliverables</FormLabel>
            <Stack
              spacing={6}
              direction={["column"]}
              w={"100%"}
              alignItems="center"
            >
              {deliverables.map((deliverable, idx) => (
                <Input
                  type="text"
                  key={`Deliverable#${idx}`}
                  _placeholder={{ color: "gray.500" }}
                  value={deliverable}
                  onChange={(event) =>
                    updateDeliverable(idx, event.target.value)
                  }
                />
              ))}
              <Button
                maxW={"md"}
                direction={["row"]}
                w={"100%"}
                alignItems="center"
                onClick={() => setDeliverables([...deliverables, ""])}
              >
                <Text ml={5} mr={5}>
                  New deliverable {"  "}{" "}
                </Text>{" "}
                <AddIcon />
              </Button>
            </Stack>
          </FormControl>
        </Stack>

        <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>

          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={createProject}
          >
            Create
          </Button>
        </Stack>
      </Flex>
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
