import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import PowerUpCard from "./PowerUpCard";

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

const samplePowerUps = {
  get_tip: {
    name: "Get Tip",
    used: false,
  },
};

const Question = ({
  question,
  options, // Needs to include the percentage
  answer, // The index of the right answer (on options)
  tips,
  powerUps, // Dictionary {powerup: {name: "PowerUp", used: boolean}}
  onWin,
  onLoose,
}) => {
  const [timer, setTimer] = useState(120);

  const [tipsActivated, setTipsActivated] = useState(false);
  const [skipActivated, setSkipActivated] = useState(false);
  const [percentageActivated, setPercentageActivated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (timer <= 0) {
        failureToast("Timer run out!");
        onLoose();
      } else {
        setTimer(timer - 1);
      }
    }, 1000);
  }, []);

  const controlUsersAnswer = (userAnswer) => {
    if (userAnswer === answer) {
      successToast("Congratulation you give the right answer!");
      onWin();
    } else {
      failureToast("You selected the wrong answer!");
      onLoose();
    }
  };

  const skip = () => {
    if (powerUps.skip === true) {
      successToast("Successfully skipped to another question!");
      onWin();
    } else {
      failureToast("Tried to skip question, but user has no skip powerups!");
    }
  };

  return (
    <div className=" min-h-screen w-full">
      <div className=" pt-36 w-full flex items-center justify-center flex-col">
        <p className=" text-center text-hr pb-6">{timer} seconds remaining</p>
        <h1 className=" text-center text-3xl text-white w-full lg:w-2/4">
          {question}
        </h1>

        {/* ------------------------------------------ */}
        {/* options */}

        {!percentageActivated && (
          <div className=" w-full lg:w-2/4 mt-20 grid grid-cols-2 gap-x-20 gap-y-10">
            {options.map(({ option }, idx) => (
              <div
                key={`option-${idx}`}
                onClick={() => controlUsersAnswer(idx)}
                className="w-full py-3 px-5 hover:bg-hr transition-all ease-linear duration-150 hover:text-pr rounded-xl bg-pr text-white font-semibold text-xl cursor-pointer"
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* tips */}

        {tipsActivated && (
          <div className=" w-full lg:w-2/4 mt-10 bg-pr text-hr rounded-md px-2 py-2 flex items-center justify-center">
            [Tip: {tips[Math.floor(Math.random() * tips.length)]} ]
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* skip */}

        {skipActivated && (
          <div className=" w-full lg:w-2/4 mt-10   flex items-center justify-center">
            <button
              onClick={skip}
              className=" px-7 py-2 rounded-md bg-hr text-pr hover:bg-pr hover:text-white font-semibold"
            >
              Skip
            </button>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* percentage */}

        <div className=" w-full lg:w-2/4 mt-20 grid grid-cols-2 gap-x-20 gap-y-10">
          {percentageActivated && (
            <>
              {options.map(({ option, percentage }, idx) => (
                <div key={`option-${idx}`}>
                  <div
                    onClick={() => controlUsersAnswer(idx)}
                    className=" w-full py-3 px-5 hover:bg-hr transition-all ease-linear duration-150 hover:text-pr rounded-xl bg-pr text-white font-semibold text-xl cursor-pointer"
                  >
                    {option}
                  </div>
                  <p className=" pt-2 text-center text-hr">{percentage}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ------------------------------------------ */}
        {/* lifeLines */}

        <div className="mt-10 w-full">
          <div className=" w-full flex items-center justify-center flex-col">
            <h1 className="  text-white pb-6 text-xl font-semibold">
              Life-Lines
            </h1>
            <div className=" lg:w-2/4 grid grid-cols-1  lg:grid-cols-4">
              {Object.keys(powerUps).map((identifier) => (
                <PowerUpCard
                  key={`powerup-${identifier}`}
                  identifier={identifier}
                  name={powerUps[identifier].name}
                  onSelect={() => (powerUps[identifier].used = true)}
                  used={powerUps[identifier].used}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
