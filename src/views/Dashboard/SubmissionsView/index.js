// Chakra imports
import {
  Flex,
  Text,
  Icon,
  Checkbox,
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
  const newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);

  return parseInt(newDate.getTime() / 1000);
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

function SubmissionReviewForm({ onHide, isOpen, onSubmit }) {
  const [approval, setApproval] = useState(true);
  const [disqualified, setDisqualified] = useState(false);
  const [review, setReview] = useState("");
  const [deadline, setDeadline] = useState(currentDate());

  return (
    <Info
      isOpen={isOpen}
      onClose={onHide}
      header={"Submission Review"}
      body={
        <div>
          <Checkbox
            isChecked={approval}
            onChange={() => setApproval(!approval)}
            marginBottom={"10px"}
          >
            Project Approved - No change required
          </Checkbox>
          <Textarea
            rows={4}
            placeholder="A review of the project. If it is being rejected, please provide a reason"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            marginTop={"10px"}
          />
          {approval === false && (
            <Checkbox
              isChecked={disqualified}
              onChange={() => setDisqualified(!disqualified)}
              marginTop={"10px"}
            >
              Project Disqualified - No more chances
            </Checkbox>
          )}
          {approval === false && disqualified === false && (
            <div style={{ marginTop: "10px" }}>
              <Text>Until when does the user have to resubmit his project</Text>
              <Input
                type="date"
                _placeholder={{ color: "gray.500" }}
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
          )}
        </div>
      }
      footer={
        <Button
          colorScheme="teal"
          onClick={() =>
            onSubmit(
              approval,
              disqualified,
              review,
              disqualified || approval ? null : deadline
            )
          }
        >
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
  const [mediators, setMediators] = useState(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [infoContent, setInfoContent] = useState(null);

  const updateSubmissions = async () => {
    try {
      const res = await baseAxios.get(`/submissions/${params.project_id}`);

      setSubmissions(res.data.submissions);
      setSubmitter(res.data.submitter);
      setMediators(
        res.data.mediators.map(({ stake_address }) => stake_address)
      );
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

  const submitReview = async (approval, disqualified, review, deadline) => {
    try {
      const res = await baseAxios.post(
        `/projects/review/${currentSubmissionId}`,
        {
          approval,
          disqualified,
          review,
          deadline: deadline ? dateToTimestamp(deadline) : null,
          reviewer: user.stakeAddress,
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
            colorScheme="gray"
            minW="110px"
            h="36px"
            fontSize="xs"
            px="1.5rem"
            onClick={() => history.push(`/admin/projects/${params.project_id}`)}
          >
            Get back to project
          </Button>
          <Flex
            align={"center"}
            direction="column"
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            {submitter?.stake_address === user?.stakeAddress && (
              <Button
                variant="outline"
                colorScheme="teal"
                borderRadius="15px"
                w="full"
                marginTop={"20px"}
                onClick={() => {
                  setShowSubmissionForm(true);
                }}
              >
                <Text fontSize="lg" fontWeight="bold">
                  Submit / Resubmit Project
                </Text>
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

            {submissions.map((submission, index) => (
              <>
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

                  {index === submissions.length - 1 &&
                    mediators?.includes(user.stakeAddress) &&
                    submission.review === null && (
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        borderRadius="15px"
                        w="full"
                        marginTop={"10px"}
                        onClick={() => {
                          setShowReviewForm(true);
                          setCurrentSubmissionId(submission.submission_id);
                        }}
                      >
                        <Text fontSize="lg" fontWeight="bold">
                          Submit Review
                        </Text>
                      </Button>
                    )}
                </Card>
                {submission.review && (
                  <Card
                    p="16px"
                    my="24px"
                    style={{ paddingLeft: "100px" }}
                    color={submission.review.approval ? "green.500" : "red.500"}
                  >
                    <CardHeader p="12px 5px" mb="12px">
                      <Text
                        fontSize="lg"
                        color={
                          submission.review.approval ? "green.500" : "red.500"
                        }
                        fontWeight="bold"
                      >
                        Review -{" "}
                        {submission.review.approval ? "Approved" : "Rejected"}
                      </Text>
                    </CardHeader>
                    <CardBody px="5px">
                      <div>
                        <Text
                          fontSize="md"
                          color="gray.500"
                          fontWeight="400"
                          mb="10px"
                        >
                          {submission.review.review}
                        </Text>
                        {submission.review.deadline && (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="400"
                            mb="10px"
                          >
                            You have until{" "}
                            {new Date(
                              submission.review.deadline * 1_000
                            ).toLocaleDateString()}
                          </Text>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </>
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

      <SubmissionReviewForm
        isOpen={showReviewForm}
        onHide={() => setShowReviewForm(false)}
        onSubmit={(approval, disqualified, review, deadline) => {
          submitReview(approval, disqualified, review, deadline).then(
            (success) => {
              if (success) {
                updateSubmissions();
                setShowReviewForm(false);
                setCurrentSubmissionId(null);
                setInfoContent({
                  header: "Success",
                  body: "Your review has been submitted",
                });
              } else {
                setShowReviewForm(false);
                setCurrentSubmissionId(null);
                setInfoContent({
                  header: "Error",
                  body: "Something went wrong",
                });
              }
            }
          );
        }}
      />

      <Info
        isOpen={infoContent !== null}
        onClose={() => {
          setInfoContent(null);
        }}
        header={infoContent?.header}
        body={infoContent?.body}
      />
    </>
  );
}
export default SubmissionsView;
