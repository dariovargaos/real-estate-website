"use client";

import Link from "next/link";

//components
import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";

//icons
import { LuHouse } from "react-icons/lu";
import { FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="1rem"
      bg="whiteAlpha.800"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      w="100%"
      backdropFilter="blur(16px)"
    >
      <Flex gap={5} alignItems="center">
        <Icon size="lg" color="#E99E35">
          <LuHouse />
        </Icon>
        <Text fontSize="xl" fontWeight="medium" fontFamily="serif">
          <Link href="/">NestDirect</Link>
        </Text>
      </Flex>

      <Flex gap={5} alignItems="center">
        <ChakraLink
          as={Link}
          href="/properties"
          color="gray.500"
          _hover={{
            color: "black",
            textDecoration: "none",
          }}
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
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
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
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
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
        >
          Sell
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/premium"
          color="gray.500"
          _hover={{
            color: "black",
            textDecoration: "none",
          }}
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
        >
          Premium
        </ChakraLink>

        <Button
          asChild
          variant="outline"
          rounded="xl"
          bg="white"
          _hover={{
            color: "white",
            bg: "#E99E35",
          }}
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>

        <Button
          asChild
          variant="plain"
          rounded="full"
          _hover={{
            color: "white",
            bg: "#E99E35",
          }}
        >
          <Link href="/profile">
            <FiUser />
          </Link>
        </Button>

        <Button asChild colorPalette="gray" variant="solid" rounded="xl">
          <Link href="/list-property">List Property</Link>
        </Button>
      </Flex>
    </Flex>
  );
}
