import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import Question from "./components/Question";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const successToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const failureToast = (message) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const createPowerUp = (powerUp) => ({
  name: powerUp,
  used: false,
});

const getRandomIndex = (length, except) => {
  let randomIndex = null;
  while (randomIndex === null || except.includes(randomIndex)) {
    randomIndex = Math.floor(Math.random() * length);
  }

  return randomIndex;
};

const Questions = () => {
  const [display, setDisplay] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState({
    0: "a) 829.8 m",
    1: "b) 826.8 m",
    2: "c) 828.8 m",
    3: "d) 824.8 m",
  });
  const [powerUps, setPowerUps] = useState([
    {
      ...createPowerUp("Get Tip"),
      onUse: () => onTipActivate("It contains an odd number"),
    },
    {
      ...createPowerUp("Get Percentage"),
      onUse: () => onGetPercentage(),
    },
    {
      ...createPowerUp("Eliminate Half"),
      onUse: () => onEliminateHalfActivate(),
    },
    {
      ...createPowerUp("Skip Question"),
      onUse: () => onSkipActivate(),
    },
  ]);
  const [powerUpsBlocked, setPowerUpsBlocked] = useState(false);

  const getPercentages = () => ({
    0: 0.4,
    1: 0.3,
    2: 0.1,
    3: 0.2,
  });

  const onAnswer = (attemptedAnswer) => {
    if (parseInt(attemptedAnswer) === answer) {
      console.log("You Win");
      successToast("Congratulation you give the right answer!");
    } else {
      console.log("You loose");
      failureToast("You selected the wrong answer!");
    }
  };

  const onSkip = () => {
    setCurrentQuestion(currentQuestion + 1);

    setPowerUpsBlocked(true);

    successToast("Successfully skipped to another question!");
  };

  const onTipActivate = (tip) => {
    setDisplay(`Tip: ${tip}`);

    let powerUpsCopy = [...powerUps];
    powerUpsCopy[0].used = true;

    setPowerUps(powerUpsCopy);

    setPowerUpsBlocked(true);
  };

  const onGetPercentage = () => {
    let optionsCopy = {};
    const percentages = getPercentages();

    const parsePercentage = (number) => (number * 100).toFixed(2);

    for (let key in options) {
      optionsCopy[key] = `${options[key]} - ${parsePercentage(
        percentages[key]
      )}%`;
    }

    setOptions(optionsCopy);

    let powerUpsCopy = [...powerUps];
    powerUpsCopy[1].used = true;

    setPowerUps(powerUpsCopy);

    setPowerUpsBlocked(true);
  };

  const onEliminateHalfActivate = () => {
    let optionsCopy = {};
    let optionsLength = Object.keys(options).length;

    let eliminateIndexes = [];
    for (let i = 0; i < Math.floor(optionsLength / 2); i++) {
      eliminateIndexes.push(
        getRandomIndex(optionsLength, [...eliminateIndexes, answer])
      );
    }

    for (let key in options) {
      if (eliminateIndexes.includes(parseInt(key))) continue;

      optionsCopy[key] = options[key];
    }

    setOptions(optionsCopy);

    let powerUpsCopy = [...powerUps];
    powerUpsCopy[2].used = true;

    setPowerUps(powerUpsCopy);

    setPowerUpsBlocked(true);
  };

  const onSkipActivate = () => {
    onSkip();

    let powerUpsCopy = [...powerUps];
    powerUpsCopy[3].used = true;

    setPowerUps(powerUpsCopy);

    setPowerUpsBlocked(true);
  };

  return (
    <Question
      question="What is the height of Burj Al Khalifa?"
      options={options}
      powerUps={powerUps}
      powerUpsDisabled={powerUpsBlocked}
      onAnswer={onAnswer}
      extraDisplay={display}
    />
  );
};

export default Questions;
