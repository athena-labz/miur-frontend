import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuOptionGroup,
  MenuItemOption,
  Flex,
  Input,
  Stack,
  Button,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

function MultiSelectMenu({
  label,
  options,
  buttonProps,
  onChange,
  addOptionInput = false,
}) {
  const [localOptions, setLocalOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");

  return (
    <Menu closeOnSelect={false}>
      {({ onClose }) => (
        <Flex justifyContent={"flex-end"}>
          <MenuButton
            type="button"
            color={"white"}
            borderWidth={1}
            p={2}
            px={4}
            width={"full"}
            borderRadius="10px"
            _focus={{
              outline: "none",
            }}
            {...buttonProps}
          >
            {`${label}${
              selectedOptions.length > 0 ? ` (${selectedOptions.join()})` : ""
            }`}
          </MenuButton>

          <MenuList>
            <MenuGroup title={undefined}>
              <MenuItem
                onClick={() => {
                  setSelectedOptions([]);
                  // Have to close, otherwise the defaultValue won't be reset correctly
                  // and so the UI won't immediately show the menu item options unselected.
                  onClose();
                }}
              >
                Clear all
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuOptionGroup
              title={undefined}
              defaultValue={selectedOptions}
              type="checkbox"
              onChange={(values) => {
                // Filter out empty strings, because, well, this component seems to add
                // an empty string out of nowhere.
                setSelectedOptions(values.filter((_) => _.length));
                onChange?.(values);
              }}
            >
              {localOptions.map((option) => {
                return (
                  // Use 'type'='button' to make sure it doesn't default to 'type'='submit'.
                  <MenuItemOption
                    key={`multiselect-menu-${option}`}
                    type="button"
                    value={option}
                  >
                    {option}
                  </MenuItemOption>
                );
              })}
              {addOptionInput ? (
                <Stack
                  direction={["row"]}
                  w={"100%"}
                  alignItems="center"
                  style={{padding: "0 1rem"}}
                >
                  <Input
                    _placeholder={{ color: "gray.500" }}
                    value={optionInput}
                    onChange={(event) => setOptionInput(event.target.value)}
                  />
                  <Button
                    maxW={"md"}
                    direction={["row"]}
                    w={"2rem"}
                    onClick={() =>
                      setLocalOptions([...localOptions, optionInput])
                    }
                  >
                    <AddIcon />
                  </Button>
                </Stack>
              ) : (
                <></>
              )}
            </MenuOptionGroup>
          </MenuList>
        </Flex>
      )}
    </Menu>
  );
}

MultiSelectMenu.displayName = "MultiSelectMenu";

export default MultiSelectMenu;
