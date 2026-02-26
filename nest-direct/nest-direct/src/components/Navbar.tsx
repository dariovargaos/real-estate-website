"use client";

import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";

//icons
import { LuHouse } from "react-icons/lu";

export default function Navbar() {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="1rem"
      bg="gray.100"
    >
      <Flex gap={5} alignItems="center">
        <Icon size="lg" color="#E99E35">
          <LuHouse />
        </Icon>
        <Text fontSize="xl" fontWeight="bold">
          NestDirect
        </Text>
      </Flex>

      <Flex gap={5} alignItems="center">
        <ChakraLink
          as={Link}
          href="/"
          color="gray.500"
          _hover={{
            color: "black",
            textDecoration: "none",
          }}
        >
          Browse
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/how-it-works"
          color="gray.500"
          _hover={{
            color: "black",
            textDecoration: "none",
          }}
        >
          How It Works
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/sell"
          color="gray.500"
          _hover={{
            color: "black",
            textDecoration: "none",
          }}
        >
          Sell
        </ChakraLink>

        <Button
          variant="outline"
          rounded="lg"
          bg="white"
          _hover={{
            color: "white",
            bg: "#E99E35",
          }}
        >
          Sign In
        </Button>
        <Button colorPalette="gray" variant="solid" rounded="lg">
          List Property
        </Button>
      </Flex>
    </Flex>
  );
}
