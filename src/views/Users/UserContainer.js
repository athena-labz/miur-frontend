/* A React component that will use call the backend to
get the user data and use the UsersTable component to
display the data. */

import React, { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";

import axios from "axios";

import UsersTable from "views/Users/UsersTable";

import PageSelector from "components/Paginator";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const UserContainer = () => {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  // Create axios fetch call to get users
  const getUsers = async () => {
    try {
      const response = await baseAxios.get(`/users?page=${currentPage}`);

      setUsers({ ...users, [currentPage]: response.data.users });
      setMaxPage(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <Card p="16px" my="24px">
      <CardHeader p="12px 5px" mb="12px">
        <Flex direction="column">
          <Text fontSize="lg" color={"white"} fontWeight="bold">
            Users
          </Text>
        </Flex>
      </CardHeader>
      <CardBody px="5px">
        {loading ? (
          <>Loading</>
        ) : (
          <UsersTable page={currentPage} users={users} />
        )}
      </CardBody>
      <CardFooter style={{ marginTop: "1rem" }}>
        <PageSelector
          maxPage={maxPage}
          initialPage={1}
          onPageChange={(page) => {
            setLoading(true);
            setCurrentPage(page);
          }}
        />
      </CardFooter>
    </Card>
  );
};

export default UserContainer;
