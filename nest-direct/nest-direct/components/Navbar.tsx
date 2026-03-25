"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

//components
import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

//hooks
import { useUser } from "../hooks/useAuthContext";
import { useUserProfile } from "../hooks/useProfile";

//icons
import { LuHouse } from "react-icons/lu";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, signOut } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();

  const firstName =
    (
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      ""
    ).split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const handleListPropertyClick = () => {
    if (!user) {
      toaster.create({
        title: "Sign in required",
        description: "You need to sign in to list your property.",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    router.push("/list-property");
  };

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
          onClick={handleListPropertyClick}
          bg="#E99E35"
          color="white"
          _hover={{ bg: "#e2a856" }}
          variant="solid"
          rounded="xl"
        >
          List Property
        </Button>

        {/* Authentication Buttons */}
        {user ? (
          // Logged in state
          <Flex gap={3} alignItems="center">
            <Text fontSize="sm" color="gray.600">
              Welcome, {firstName}
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
          <Button asChild rounded="xl" colorPalette="gray">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
