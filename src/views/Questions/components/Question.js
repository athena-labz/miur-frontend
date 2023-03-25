import React, { useState, useEffect } from "react";

import PowerUpCard from "./PowerUpCard";

const samplePowerUps = {
  get_tip: {
    name: "Get Tip",
    used: false,
  },
};

const Question = ({
  question,
  options,
  powerUps,
  powerUpsDisabled,
  onAnswer,
  extraDisplay,
}) => {
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    setTimeout(() => {
      if (timer <= 0) {
        failureToast("Timer run out!");
        onAnswer(0); // Answer anything - backend should detect that time run out
      } else {
        setTimer(timer - 1);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(
      options
        .map((option, idx) => [option, idx])
        .filter(([option, _]) => option !== null)
        .map(([option, idx]) => option)
    );
  }, [options]);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center flex-col">
        <p className=" text-center text-hr pb-6">{timer} seconds remaining</p>
        <h1 className="text-center text-3xl text-white w-full">{question}</h1>

        {/* ------------------------------------------ */}
        {/* options */}

        <div className=" w-full mt-20 grid grid-cols-2 gap-x-20 gap-y-10">
          {options
            .map((option, idx) => [option, idx])
            .filter(([option, _]) => option !== null)
            .map(([option, idx]) => (
              <div
                key={`option-${idx}`}
                onClick={() => onAnswer(idx)}
                className="w-full py-3 px-5 hover:bg-hr transition-all ease-linear duration-150 hover:text-pr rounded-xl bg-pr text-white font-semibold text-xl cursor-pointer"
              >
                {option}
              </div>
            ))}
        </div>

        {/* ------------------------------------------ */}
        {/* display */}

        {extraDisplay && (
          <div className=" w-full mt-10 bg-pr text-hr rounded-md px-2 py-2 flex items-center justify-center">
            {extraDisplay}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* lifeLines */}

        <div className="mt-10 w-full">
          <div className=" w-full flex items-center justify-center flex-col">
            <h1 className=" text-white pb-6 text-xl font-semibold">
              Life-Lines
            </h1>
            <div
              className="grid grid-cols-1 lg:grid-cols-3"
              style={{ gap: "3rem" }}
            >
              {powerUps.map(({ name, used, onUse }, idx) => (
                <PowerUpCard
                  key={`powerup-${idx}`}
                  identifier={idx}
                  name={name}
                  onSelect={onUse}
                  used={used}
                  disabled={powerUpsDisabled}
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
