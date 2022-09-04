import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { UserContext_ } from "contexts/userContext";
import { useWallet } from "contexts/walletContext";
import { Redirect } from "react-router-dom";

import { WalletSelector } from "components/WalletSelector";
import { Info } from "components/Info";

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Assets

function SignIn() {
  // Chakra color mode
  const titleColor = "teal.200";
  const textColor = "black.200";

  const signInImage =
    "https://www.investright.org/wp-content/uploads/2021/09/Start-up-Crowdfunding-blog-Sept-2021.jpg";

  const { signIn, signUp } = useContext(UserContext_);
  const { connect, curWallet } = useWallet();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [infoContent, setInfoContent] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [openWalletSelector, setOpenWalletSelector] = useState(false);

  return (
    <>
      {isSignedIn ? (
        <Redirect from={`/`} to="/admin/dashboard" />
      ) : (
        <>
          <Flex position="relative" mb="40px">
            <Flex
              h={{ sm: "initial", md: "75vh", lg: "85vh" }}
              w="100%"
              maxW="1044px"
              mx="auto"
              justifyContent="space-between"
              mb="30px"
              pt={{ sm: "100px", md: "0px" }}
            >
              <Flex
                alignItems="center"
                justifyContent="start"
                style={{ userSelect: "none" }}
                w={{ base: "100%", md: "50%", lg: "42%" }}
              >
                <Flex
                  direction="column"
                  w="100%"
                  background="transparent"
                  p="48px"
                  mt={{ md: "150px", lg: "80px" }}
                >
                  <Heading color={titleColor} fontSize="32px" mb="10px">
                    Welcome
                  </Heading>
                  <Text
                    mb={isWalletConnected ? "36px" : "0px"}
                    ms="4px"
                    color={textColor}
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {isWalletConnected
                      ? "Enter your email to sign in"
                      : "Please connect your wallet before signing in"}
                  </Text>
                  <FormControl isRequired>
                    {isWalletConnected ? (
                      <>
                        <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                          Email
                        </FormLabel>
                        <Input
                          borderRadius="15px"
                          mb="24px"
                          isRequired
                          fontSize="sm"
                          type="text"
                          placeholder="Your email adress"
                          size="lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <Button
                      onClick={
                        isWalletConnected
                          ? () =>
                              signUp(baseAxios, curWallet, email, email)
                                .then(() => {
                                  setIsSignedIn(true);
                                })
                                .catch((err) => {
                                  if (
                                    err.response.data.code === "address-exists"
                                  ) {
                                    setInfoContent({
                                      header: "Sign Up Error",
                                      body: "Address already registered!",
                                    });
                                  } else if (
                                    err.response.data.code === "nickname-exists"
                                  ) {
                                    setInfoContent({
                                      header: "Sign Up Error",
                                      body: "Email already registered!",
                                    });
                                  } else {
                                    console.dir(err)
                                  }
                                })
                          : () => setOpenWalletSelector(true)
                      }
                      fontSize="md"
                      type="submit"
                      bg="teal.300"
                      w="100%"
                      h="45"
                      mb="20px"
                      color="white"
                      mt="20px"
                      _hover={{
                        bg: "teal.200",
                      }}
                      _active={{
                        bg: "teal.400",
                      }}
                    >
                      {isWalletConnected ? "SIGN IN" : "CONNECT WALLET"}
                    </Button>
                  </FormControl>
                </Flex>
              </Flex>
              <Box
                display={{ base: "none", md: "block" }}
                overflowX="hidden"
                h="100%"
                w="45vw"
                position="absolute"
                right="0px"
              >
                <Box
                  bgImage={signInImage}
                  w="100%"
                  h="100%"
                  bgSize="cover"
                  bgPosition="50%"
                  position="absolute"
                  borderBottomLeftRadius="20px"
                ></Box>
              </Box>
            </Flex>
          </Flex>
          <WalletSelector
            isOpen={openWalletSelector}
            onSelect={async (wallet) => {
              connect(wallet)
                .then(async (result) => {
                  if (result.success === true) {
                    const signedIn = await signIn(baseAxios, result.api);

                    if (signedIn) setIsSignedIn(true);
                    else setIsWalletConnected(true);
                  } else {
                    console.error("Wallet failed while trying to connect!");
                    console.error(result.error);
                  }

                  setOpenWalletSelector(false);
                })
                .catch((err) => {
                  console.error(err);
                  console.error("Wallet refused to connect!");
                  setOpenWalletSelector(false);
                });
            }}
            onClose={() => setOpenWalletSelector(false)}
          />
          <Info
            isOpen={infoContent !== null}
            onClose={() => setInfoContent(null)}
            header={infoContent?.header}
            body={infoContent?.body}
          />
        </>
      )}
    </>
  );
}

export default SignIn;
