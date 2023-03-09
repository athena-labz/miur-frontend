// Chakra imports
import {
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";

import { FaPlus } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import { Info } from "components/Info";

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

function ProjectSubmissionForm({ onHide, isOpen, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Info
      isOpen={isOpen}
      onClose={onHide}
      header={"Project Submission"}
      body={
        <div>
          <Input
            placeholder="A summary of what you've done"
            marginBottom={"20px"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            rows={4}
            placeholder="A description of your work with links to where a reviewer can find it"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      }
      footer={
        <Button colorScheme="teal" onClick={() => onSubmit(title, content)}>
          Submit
        </Button>
      }
    />
  );
}

function SubmissionsView() {
  const { user } = useUser();
  // const { curWallet, connect } = useWallet();

  const history = useHistory();
  const params = useParams();

  // Chakra color mode
  const textColor = "white";
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const [submissions, setSubmissions] = useState(null);
  const [submitter, setSubmitter] = useState(null);

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [infoContent, setInfoContent] = useState(null);

  const updateSubmissions = async () => {
    try {
      const res = await baseAxios.get(`/submissions/${params.project_id}`);

      setSubmissions(res.data.submissions);
      setSubmitter(res.data.submitter);
    } catch (error) {
      console.dir(error);
    }
  };

  const submitProject = async (title, content) => {
    try {
      const res = await baseAxios.post(
        `/projects/submit/${params.project_id}`,
        {
          title,
          content,
          signature: user.signature,
        }
      );

      console.log(res);

      return true;
    } catch (error) {
      console.dir(error);

      return false;
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
            {submitter?.stake_address === user?.stakeAddress && (
              <Button
                p="0px"
                bg="transparent"
                color="gray.500"
                border="1px solid lightgray"
                borderRadius="15px"
                w="full"
                marginTop={"20px"}
                onClick={() => {
                  setShowSubmissionForm(true);
                }}
              >
                <Flex
                  justifyContent="center"
                  align="center"
                  alignItems={"center"}
                >
                  <Icon as={FaPlus} fontSize="lg" marginRight={"20px"} />
                  <Text fontSize="lg" fontWeight="bold">
                    Submit Project
                  </Text>
                </Flex>
              </Button>
            )}

            {submissions.length === 0 && (
              <Text
                fontSize="lg"
                color={textColor}
                fontWeight="bold"
                marginTop={"20px"}
              >
                No submissions yet
              </Text>
            )}

            {submissions.map((submission) => (
              <Card p="16px" my="24px">
                <CardHeader p="12px 5px" mb="12px">
                  <Text fontSize="lg" color={textColor} fontWeight="bold">
                    {submission.title}
                  </Text>
                </CardHeader>
                <CardBody px="5px">
                  <Text
                    fontSize="md"
                    color="gray.500"
                    fontWeight="400"
                    mb="30px"
                  >
                    {submission.content}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Flex>
        </>
      )}
      <ProjectSubmissionForm
        isOpen={showSubmissionForm}
        onHide={() => setShowSubmissionForm(false)}
        onSubmit={(title, content) => {
          submitProject(title, content).then((success) => {
            if (success) {
              updateSubmissions();
              setShowSubmissionForm(false);
              setInfoContent({
                header: "Success",
                body: "Your project has been submitted",
              });
            } else {
              setShowSubmissionForm(false);
              setInfoContent({
                header: "Error",
                body: "Something went wrong",
              });
            }
          });
        }}
      />

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
export default SubmissionsView;
