"use client";

import Link from "next/link";

//components
import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { toaster, Toaster } from "./ui/toaster";

//hooks
import { useUser } from "../hooks/useAuthContext";

//icons
import { LuHouse } from "react-icons/lu";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, isLoading, signOut } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();

      toaster.create({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
        type: "success",
        duration: 5000,
      });
    } catch (error: any) {
      toaster.create({
        title: "Logout failed",
        description: error.message || "Something went wrong.",
        type: "error",
        duration: 5000,
      });
    }
  };
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

        <Button asChild colorPalette="gray" variant="solid" rounded="xl">
          <Link href="/list-property">List Property</Link>
        </Button>

        {/* Authentication Buttons */}
        {isLoading ? (
          // Loading state
          <Button disabled variant="outline" rounded="xl" bg="white">
            Loading...
          </Button>
        ) : user ? (
          // Logged in state
          <Flex gap={3} alignItems="center">
            <Text fontSize="sm" color="gray.600">
              Welcome, {user.user_metadata?.first_name || user.email}
            </Text>
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
            <Button
              onClick={handleLogout}
              variant="outline"
              rounded="xl"
              bg="white"
              size="sm"
              _hover={{
                color: "white",
                bg: "red.500",
              }}
            >
              <FiLogOut />
              Sign Out
            </Button>
          </Flex>
        ) : (
          // Logged out state
          <Flex gap={3} alignItems="center">
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
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </Flex>
        )}
      </Flex>
      <Toaster />
    </Flex>
  );
}
