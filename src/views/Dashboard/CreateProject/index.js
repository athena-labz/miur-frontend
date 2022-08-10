// Chakra imports
import { Flex, Grid, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React, { useState } from "react";
import { FaCube, FaPenFancy } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import Projects from "./components/Projects";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { AddIcon, SmallCloseIcon } from '@chakra-ui/icons';
import MultiSelectMenu from "components/MultipleSelect";

function CreateProject() {
  // Chakra color mode
  const textColor = "white"
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  const options = ["Noa Rahman", "Julie Molina", "Leonidas Browning", "Qiang He", "Dong Liu", "Zack Jacobs"];

  const [deliverables, setDeliverables] = useState(["tem1"])

  return (
    <Flex
      align={'center'}
      direction='column'
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'100%'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}

      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Create a Project
        </Heading>

        <FormControl id="title" isRequired>
          <FormLabel>Title  </FormLabel>
          <Input
            placeholder="Title"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Short Description</FormLabel>
          <Input
            placeholder="long_description"
            _placeholder={{ color: 'gray.500' }}
          />
        </FormControl>
        <FormControl id="long_description" isRequired>
          <FormLabel> Long Description</FormLabel>
          <Textarea
            placeholder="long_description"
            _placeholder={{ color: 'gray.500' }}

          />
        </FormControl>

        <FormControl id="long_description" isRequired>
          <FormLabel> Subjects</FormLabel>
          <MultiSelectMenu label="Subjects Selecteds" options={options} />
        </FormControl>


        <Stack spacing={6} direction={['column', 'row']} w={'100%'}>
          <FormControl id="reward_requested" isRequired>
            <FormLabel> Reward requested</FormLabel>
            <Input
              type='number'
              placeholder="informer adasda  sadas d"
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <FormControl id="reward_requested" isRequired>
            <FormLabel> Colateral</FormLabel>
            <Input
              type='number'
              placeholder="informer adasda  sadas d"
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <FormControl id="reward_requested" isRequired>
            <FormLabel> Days to complete</FormLabel>
            <Input
              type='number'
              placeholder="informer adasda  sadas d"
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>
        </Stack>


        <FormControl id="reward_requested" isRequired>
          <FormLabel> Deliverables</FormLabel>
          <Stack spacing={6} direction={['column']} w={'100%'} alignItems="center">
            {deliverables.map((item) =>
              <Input
                type='number'
                key={item}
                placeholder="informer adasda  sadas d"
                _placeholder={{ color: 'gray.500' }}
              />
            )}
            <Button maxW={"md"} direction={['row']} w={'100%'} alignItems="center" onClick={() => setDeliverables([...deliverables, `Item${deliverables.length}`])}>
              <Text ml={5} mr={5}>New deliverable {"  "} </Text> <AddIcon />
            </Button>
          </Stack>

        </FormControl>


      </Stack>

      <Stack spacing={6} direction={['column', 'row']} w={'100%'}>
        <Button
          bg={'red.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'red.500',
          }}>
          Cancel
        </Button>

        <Button
          bg={'blue.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'blue.500',
          }}>
          Save
        </Button>
      </Stack>
    </Flex>
  );
}
export default CreateProject;
