import React, { useState, useEffect } from "react";

import Question from "./components/Question";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const Questions = () => {
  return (
    <Question
      question="What is the height of Burj Al Khalifa?"
      options={[
        { option: "a) 829.8 m", percentage: 0.4 },
        { option: "b) 826.8 m", percentage: 0.3 },
        { option: "c) 828.8 m", percentage: 0.1 },
        { option: "d) 824.8 m", percentage: 0.2 },
      ]}
      answer={0}
      tips={["The value contains a odd number."]}
      powerUps={{
        get_tip: {
          name: "Get Tip",
          used: false,
        },
        get_percentage: {
          name: "Get Percentage",
          used: false,
        },
        eliminate_half: {
          name: "Eliminate Half",
          used: false,
        },
        skip: {
          name: "Skip Question",
          used: false,
        },
      }}
      onWin={() => console.log("You Win")}
      onLoose={() => console.log("You Lost")}
    />
  );
};

export default Questions;
