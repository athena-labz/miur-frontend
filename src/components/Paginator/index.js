/* A React component that allows the user to select the current
page and calls a callback function received form it's props
with the current page every time it's changed. It should
have the min and max pages as the first and last buttons */

import React, { useState } from "react";
import { Flex, Text, Button } from "@chakra-ui/react";

const PageSelector = (props) => {
  const [currentPage, setCurrentPage] = useState(props.initialPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    props.onPageChange(newPage);
  };

  const spacing = "0.5rem";

  return (
    <Flex justifyContent="center" alignItems="center">
      <Button onClick={() => handlePageChange(1)}>{1}</Button>
      {props.maxPage > 3 && (
        <>
          <Button
            style={{ marginLeft: spacing }}
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          >
            {"<"}
          </Button>
          <Text style={{ marginLeft: spacing }}>{currentPage}</Text>
          <Button
            style={{ marginLeft: spacing }}
            onClick={() =>
              handlePageChange(Math.min(props.maxPage, currentPage + 1))
            }
          >
            {">"}
          </Button>
        </>
      )}
      {props.maxPage > 1 && (
        <Button
          style={{ marginLeft: spacing }}
          onClick={() => handlePageChange(props.maxPage)}
        >
          {props.maxPage}
        </Button>
      )}
    </Flex>
  );
};

export default PageSelector;
