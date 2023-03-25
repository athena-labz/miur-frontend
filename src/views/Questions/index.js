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

const parseQuestionsToQuestion = (questions, currentQuestion) => {
  return questions[currentQuestion]["question"];
};

const parseQuestionsToOptions = (questions, currentQuestion) => {
  return questions[currentQuestion]["answers"];

  let options = {};

  questions[currentQuestion]["answers"].forEach((option, idx) => {
    options[idx] = option;
  });

  return options;
};

const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(null);
  const [remainingOptions, setRemainingOptions] = useState(null);

  const [tipsUsed, setTipsUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [eliminateUsed, setEliminateUsed] = useState(false);

  const params = useParams();
  const history = useHistory();

  const { user, getUser } = useUser();

  const handlePowerUp = (powerups, currentQuestion) => {
    for (let i = 0; i < powerups.length; i++) {
      if (
        powerups[i].used &&
        powerups[i].question_index_used === currentQuestion
      ) {
        switch (powerups[i].name) {
          case "get_hints":
            setDisplay(`Tip: ${powerups[i].payload.hint}`);
            break;
          case "skip_question":
            onAnswer(powerups[i].payload.answer.toString(), true);
            break;
          case "eliminate_half":
            setRemainingOptions(powerups[i].payload.remaining_choices);
            break;
          default:
            break;
        }
      }
    }
  };

  const reloadValues = async () => {
    const res = await baseAxios.get(`/quiz/assignment/${params.question_id}`);

    const { current_question, questions, quiz_id, powerups } = res.data;

    setDisplay(null);
    setRemainingOptions(null);

    setQuestions(questions);
    setCurrentQuestion(current_question);

    for (let i = 0; i < powerups.length; i++) {
      switch (powerups[i].name) {
        case "get_hints":
          setTipsUsed(powerups[i].used);
          break;
        case "skip_question":
          setSkipUsed(powerups[i].used);
          break;
        case "eliminate_half":
          setEliminateUsed(powerups[i].used);
          break;
        default:
          break;
      }
    }

    handlePowerUp(powerups, current_question);

    setLoading(false);
  };

  useEffect(() => {
    reloadValues();
  }, []);

  const onAnswer = async (attemptedAnswer, skipped = false) => {
    const user = getUser();

    console.log("Attempting answer", user);
    const res = await baseAxios.post(`/quiz/attempt/${params.question_id}`, {
      signature: user.signature,
      answer: parseInt(attemptedAnswer),
    });

    if (res.data.right_answer === true) {
      if (res.data.state === "completed_success") {
        setLoading(true);

        successToast("Congratulations, you win the quiz!");
        history.push("/admin/profile");
      } else {
        if (skipped) {
          successToast("Successfully skipped to another question!");
        } else {
          successToast("Awesome, that was the right answer!");
        }

        setCurrentQuestion(currentQuestion + 1);
        reloadValues();

        return true;
      }
    } else {
      if (res.data.state === "completed_failure") {
        setLoading(true);

        if (skipped) {
          failureToast(
            "This is completely unexpected, tried to skip a question but failed! This was your last attempt! Talk with a teach or somoeone from the team to reset your quiz."
          );
        } else {
          failureToast(
            "Oh no, this was your last attempt! You'll have to try another quiz later."
          );
        }

        history.push("/admin/profile");

        return false;
      } else {
        if (skipped) {
          failureToast(
            "Something went wrong, you were not able to skip the question and lost one attempt! If this causes you to fail, talk with a teach or somoeone from the team to reset your quiz."
          );
        } else {
          failureToast(
            `Woops, that was the wrong answer, you have ${res.data.remaining_attempts} more tries`
          );
        }

        return false;
      }
    }
  };

  const usePowerUp = async (axios, user, questionAssignmentId, name) => {
    try {
      const res = await axios.post(
        `/quiz/powerup/${questionAssignmentId}/activate/${name}`,
        {
          stake_address: user.stakeAddress,
          signature: user.signature,
        }
      );

      reloadValues();

      return Promise.resolve(res.data);
    } catch (e) {
      console.error(e);

      failureToast(`Something went wrong: ${e}`);

      return Promise.reject(e);
    }
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
            options={
              remainingOptions
                ? remainingOptions
                : parseQuestionsToOptions(questions, currentQuestion)
            }
            powerUps={[
              {
                name: "Get Tip",
                used: tipsUsed,
                onUse: () => {
                  usePowerUp(baseAxios, user, params.question_id, "get_hints");
                },
              },
              {
                name: "Eliminate Half",
                used: eliminateUsed,
                onUse: () => {
                  usePowerUp(
                    baseAxios,
                    user,
                    params.question_id,
                    "eliminate_half"
                  );
                },
              },
              {
                name: "Skip Question",
                used: skipUsed,
                onUse: () => {
                  usePowerUp(
                    baseAxios,
                    user,
                    params.question_id,
                    "skip_question"
                  );
                },
              },
            ]}
            onAnswer={onAnswer}
            extraDisplay={display}
          />
        </>
      )}
    </>
  );
};

export default Questions;
