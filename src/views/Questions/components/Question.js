import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PowerUpCard from "./PowerUpCard";

function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function shuffle(seed, array) {
  // Create cyrb128 state:
  var seed = cyrb128(seed);

  // Four 32-bit component hashes provide the seed for sfc32.
  var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(rand() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const Question = ({
  question,
  options,
  powerUps,
  powerUpsDisabled,
  onAnswer,
  extraDisplay,
}) => {
  const params = useParams();

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center flex-col">
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
              {shuffle(params.question_id, powerUps).map(({ name, used, onUse }, idx) => (
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
