// React
import { useEffect, useState } from "react";

// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import AssignedQuizCard from "./AssignedQuizCard";

const AssignedQuizes = ({ title, description, quizes }) => {
  // Chakra color mode
  const textColor = "white"

  return (
    <Card p='16px' my='24px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Flex direction='column'>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            {title}
          </Text>
          <Text fontSize='sm' color='gray.500' fontWeight='400'>
            {description}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody px='5px'>
        {quizes?.length > 0 ? (
          <Grid
            templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }}
            templateRows={{ sm: "1fr 1fr 1fr auto", md: "1fr 1fr", xl: "1fr" }}
            gap='24px'>
            {quizes.map((quiz, idx) => (
              <AssignedQuizCard
                key={`quiz-card-${idx}`}
                quizId={quiz.quiz_assignment_id}
                name={quiz.questions[0]["question"]}
                creator={quiz.creator_name}
              />
            ))}
          </Grid>
        ) : <Text fontSize='sm' color='gray.500' fontWeight='400'>No quizes yet</Text>}
      </CardBody>
    </Card>
  );
};

export default AssignedQuizes;
