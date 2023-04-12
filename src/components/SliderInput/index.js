import * as React from "react";
import { useState, useEffect } from "react";

import {
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

export function SliderInput({
  value,
  setValue,
  format = (val) => val,
  parse = (val) => val,
}) {
  // const [value, setValue] = useState(0);
  const handleChange = (value) => setValue(parse(value));

  useEffect(() => {
    console.log("value", value)
  }, [value])

  return (
    <Flex>
      <Input
        type="text"
        maxW="150px"
        mr="2rem"
        value={format(value)}
        onChange={() => {}}
        style={{cursor: "blocked", pointerEvents: 'none'}}
      >
        {/* <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper> */}
      </Input>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
        min={100}
        max={10_000}
        step={100}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" />
      </Slider>
    </Flex>
  );
}
