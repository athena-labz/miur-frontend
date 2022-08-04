import React, { useContext, useState } from "react";
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
import { Redirect } from "react-router-dom";
// Assets

function SignIn() {
  // Chakra color mode
  const titleColor = "teal.200"
  const textColor = "white"

  const signInImage = "https://www.investright.org/wp-content/uploads/2021/09/Start-up-Crowdfunding-blog-Sept-2021.jpg"

  const { login } = useContext(UserContext_);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const submitLogin = async () => {
    const correctCredentials = await login(email, password);
    setIsSignedIn(correctCredentials);
   // document.location.reload(true);
  }

  return (
    <>
      {isSignedIn ?
        <Redirect from={`/`} to="/admin/dashboard" />
        :
        (<Flex position='relative' mb='40px'>
          <Flex
            h={{ sm: "initial", md: "75vh", lg: "85vh" }}
            w='100%'
            maxW='1044px'
            mx='auto'
            justifyContent='space-between'
            mb='30px'
            pt={{ sm: "100px", md: "0px" }}>
            <Flex
              alignItems='center'
              justifyContent='start'
              style={{ userSelect: "none" }}
              w={{ base: "100%", md: "50%", lg: "42%" }}>
              <Flex
                direction='column'
                w='100%'
                background='transparent'
                p='48px'
                mt={{ md: "150px", lg: "80px" }}>
                <Heading color={titleColor} fontSize='32px' mb='10px'>
                  Welcome Back
                </Heading>
                <Text
                  mb='36px'
                  ms='4px'
                  color={textColor}
                  fontWeight='bold'
                  fontSize='14px'>
                  Enter your email and password to sign in
                </Text>
                <FormControl isRequired>
                  <FormLabel ms='4px' fontSize='sm' fontWeight='normal' >
                    Email
                  </FormLabel>
                  <Input
                    borderRadius='15px'
                    mb='24px'
                    isRequired
                    fontSize='sm'
                    type='text'
                    placeholder='Your email adress'
                    size='lg'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                    Password
                  </FormLabel>
                  <Input
                    borderRadius='15px'
                    mb='36px'
                    fontSize='sm'
                    type='password'
                    placeholder='Your password'
                    size='lg'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControl display='flex' alignItems='center'>
                    <Switch id='remember-login' colorScheme='teal' me='10px' />
                    <FormLabel
                      htmlFor='remember-login'
                      mb='0'
                      ms='1'
                      fontWeight='normal'>
                      Remember me
                    </FormLabel>
                  </FormControl>
                  <Button
                    onClick={submitLogin}
                    fontSize='md'
                    type='submit'
                    bg='teal.300'
                    w='100%'
                    h='45'
                    mb='20px'
                    color='white'
                    mt='20px'
                    _hover={{
                      bg: "teal.200",
                    }}
                    _active={{
                      bg: "teal.400",
                    }}>
                    SIGN IN
                  </Button>
                </FormControl>
                <Flex
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  maxW='100%'
                  mt='0px'>
                  <Text color={textColor} fontWeight='medium'>
                    Don't have an account?
                    <Link color={titleColor} as='span' ms='5px' fontWeight='bold'>
                      Sign Up
                    </Link>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Box
              display={{ base: "none", md: "block" }}
              overflowX='hidden'
              h='100%'
              w='45vw'
              position='absolute'
              right='0px'>
              <Box
                bgImage={signInImage}
                w='100%'
                h='100%'
                bgSize='cover'
                bgPosition='50%'
                position='absolute'
                borderBottomLeftRadius='20px'></Box>
            </Box>
          </Flex>
        </Flex>)
      }
    </>
  );
}

export default SignIn;
