import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { toast } from "react-toastify";

import Question from "./components/Question";

import { useUser } from "../../contexts/userContext";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import axios from "axios";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

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
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [display, setDisplay] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(null);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState(null);
  const [powerUps, setPowerUps] = useState([
    {
      ...createPowerUp("Get Tip"),
      onUse: () => {
        getTipBackend();
      },
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

  const params = useParams();
  const history = useHistory();

  const { user, getUser } = useUser();

  const getTipBackend = async () => {
    const userLocal = getUser();

    const res = await baseAxios.post(
      `/quiz/powerup/${params.question_id}/activate/get_hints`,
      {
        stake_address: userLocal.stakeAddress,
        signature: userLocal.signature,
      }
    );

    if (!res.data.success) {
      console.error("error");
      console.log(res.data);

      failureToast(`Something went wrong: ${res.data.message}`);

      return;
    } else {
      onTipActivate(res.data.powerup_payload.hint);
    }

    return res.data;
  };

  const parseQuestionsToQuestion = (questions, currentQuestion) => {
    return questions[currentQuestion]["question"];
  };

  const parseQuestionsToOptions = (questions, currentQuestion) => {
    let options = {};
    questions[currentQuestion]["answers"].forEach((option, idx) => {
      options[idx] = option;
    });

    return options;
  };

  const reloadValues = async () => {
    const res = await baseAxios.get(`/quiz/assignment/${params.question_id}`);

    const { current_question, questions, quiz_id } = res.data;

    setQuizId(quiz_id);
    setQuestions(questions);
    setCurrentQuestion(current_question);

    setLoading(false);
  };

  useEffect(() => {
    reloadValues();
  }, []);

  const getPercentages = async () => {
    const userLocal = getUser();

    const res = await baseAxios.post(
      `/quiz/powerup/${params.question_id}/activate/get_percentages`,
      {
        stake_address: userLocal.stakeAddress,
        signature: userLocal.signature,
      }
    );

    console.log("percentages", res.data)

    if (!res.data.success) {
      console.error("error");
      console.log(res.data);

      failureToast(`Something went wrong: ${res.data.message}`);

      return null;
    } else {
      let result = {};

      res.data.powerup_payload.percentages.forEach((percentage, idx) => {
        result[idx] = percentage;
      });

      console.log("result", result)

      return result;
    }
  };

  const onAnswer = async (attemptedAnswer) => {
    console.log("Attempting answer", user);
    const res = await baseAxios.post(`/quiz/attempt/${quizId}`, {
      stake_address: user.stakeAddress,
      signature: user.signature,
      answer: parseInt(attemptedAnswer),
    });

    // right answer
    // state
    // current_question
    // remaining_attempts

    console.log(res.data);

    if (res.data.right_answer === true) {
      if (res.data.state === "completed_success") {
        setLoading(true);

        successToast("Congratulations, you win the quiz!");
        history.push("/admin/profile");
      } else {
        // setLoading(true);
        successToast("Awesome, that was the right answer!");
        setCurrentQuestion(currentQuestion + 1);
      }
    } else {
      if (res.data.state === "completed_failure") {
        setLoading(true);

        failureToast(
          "Oh no, this was your last attempt! You'll have to try another quiz later."
        );
        history.push("/admin/profile");
      } else {
        failureToast(
          `Woops, that was the wrong answer, you have ${res.data.remaining_attempts} more tries`
        );
      }
    }

    // if (parseInt(attemptedAnswer) === answer) {
    //   console.log("You Win");
    //   successToast("Congratulation you give the right answer!");
    // } else {
    //   console.log("You loose");
    //   failureToast("You selected the wrong answer!");
    // }
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

  const onGetPercentage = async () => {
    let optionsCopy = {};
    const percentages = await getPercentages();

    const parsePercentage = (number) => (number * 100).toFixed(2);

    for (let key in options) {
      optionsCopy[key] = `${options[key]} - ${parsePercentage(
        percentages[key]
      )}%`;
    }

    console.log("options", options)
    console.log("%", optionsCopy)

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
    <>
      {loading ? (
        <div className="loader-container">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <Question
            question={parseQuestionsToQuestion(questions, currentQuestion)}
            options={parseQuestionsToOptions(questions, currentQuestion)}
            powerUps={powerUps}
            powerUpsDisabled={powerUpsBlocked}
            onAnswer={onAnswer}
            extraDisplay={display}
          />
        </>
      )}
    </>
  );
};

export default Questions;
