"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

//components
import {
  Button,
  CloseButton,
  Drawer,
  Flex,
  Icon,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

//hooks
import { useUser } from "../hooks/useAuthContext";
import { useUserProfile } from "../hooks/useProfile";

//icons
import { LuHouse } from "react-icons/lu";
import { FiMenu, FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, signOut } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setDrawerOpen(false);
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
    setDrawerOpen(false);
    try {
      await signOut();

      toaster.create({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
        type: "success",
        duration: 5000,
      });
    } catch (error: unknown) {
      toaster.create({
        title: "Logout failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
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
      {/* Logo */}
      <Flex align="center" gap={2}>
        <Icon size="lg" color="#E99E35">
          <LuHouse />
        </Icon>
        <Text fontSize="xl" fontWeight="medium" fontFamily="serif">
          <Link href="/">NestDirect</Link>
        </Text>
      </Flex>

      {/* Desktop nav */}
      <Flex gap={5} alignItems="center" display={{ base: "none", md: "flex" }}>
        <ChakraLink
          as={Link}
          href="/properties"
          color="gray.500"
          _hover={{ color: "black", textDecoration: "none" }}
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
        >
          Browse
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/how-it-works"
          color="gray.500"
          _hover={{ color: "black", textDecoration: "none" }}
          _focus={{ boxShadow: "none", outline: "none" }}
          _active={{ boxShadow: "none", outline: "none" }}
        >
          How It Works
        </ChakraLink>

        <ChakraLink
          as={Link}
          href="/premium"
          color="gray.500"
          _hover={{ color: "black", textDecoration: "none" }}
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

        {user ? (
          <Flex gap={3} alignItems="center">
            <Text fontSize="sm" color="gray.600">
              Welcome, {firstName}
            </Text>
            <Button
              asChild
              variant="plain"
              rounded="full"
              _hover={{ color: "white", bg: "#E99E35" }}
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
              _hover={{ color: "white", bg: "red.500" }}
            >
              <FiLogOut />
              Sign Out
            </Button>
          </Flex>
        ) : (
          <Button asChild rounded="xl" colorPalette="gray">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </Flex>

      {/* Mobile right-side actions */}
      <Flex align="center" display={{ base: "flex", md: "none" }}>
        {user && (
          <Button
            asChild
            rounded="full"
            color="white"
            size="sm"
            bg="#E99E35"
            _hover={{ bg: "#e2a856" }}
          >
            <Link href="/profile">
              <FiUser />
            </Link>
          </Button>
        )}

        {/* Mobile hamburger */}
        <Drawer.Root
          open={drawerOpen}
          onOpenChange={(e) => setDrawerOpen(e.open)}
          placement="top"
        >
          <Drawer.Trigger asChild>
            <Button variant="ghost" aria-label="Open menu">
              <FiMenu size={22} />
            </Button>
          </Drawer.Trigger>

          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content h="auto">
                <Drawer.Header>
                  <Drawer.Title>
                    <Flex direction="column" gap={0.5}>
                      <Link href="/" onClick={() => setDrawerOpen(false)}>
                        <Flex gap={2} alignItems="center">
                          <Icon size="md" color="#E99E35">
                            <LuHouse />
                          </Icon>
                          NestDirect
                        </Flex>
                      </Link>
                      {user && (
                        <Text
                          fontSize="md"
                          color="gray.500"
                          fontWeight="normal"
                        >
                          Welcome, {firstName}
                        </Text>
                      )}
                    </Flex>
                  </Drawer.Title>
                </Drawer.Header>

                <Drawer.Body pb={4}>
                  <VStack align="stretch" gap={4}>
                    <ChakraLink
                      as={Link}
                      href="/properties"
                      color="gray.700"
                      fontSize="md"
                      _hover={{ color: "#E99E35", textDecoration: "none" }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Browse
                    </ChakraLink>

                    <ChakraLink
                      as={Link}
                      href="/how-it-works"
                      color="gray.700"
                      fontSize="md"
                      _hover={{ color: "#E99E35", textDecoration: "none" }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      How It Works
                    </ChakraLink>

                    <ChakraLink
                      as={Link}
                      href="/premium"
                      color="gray.700"
                      fontSize="md"
                      _hover={{ color: "#E99E35", textDecoration: "none" }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Premium
                    </ChakraLink>

                    <Flex gap={2}>
                      <Button
                        onClick={handleListPropertyClick}
                        bg="#E99E35"
                        color="white"
                        _hover={{ bg: "#e2a856" }}
                        variant="solid"
                        rounded="xl"
                        flex={1}
                      >
                        List Property
                      </Button>

                      {user ? (
                        <>
                          <Button
                            asChild
                            colorPalette="gray"
                            rounded="xl"
                            flex={1}
                            onClick={() => setDrawerOpen(false)}
                          >
                            <Link href="/profile">
                              <FiUser />
                              My Profile
                            </Link>
                          </Button>
                          <Button
                            onClick={handleLogout}
                            colorPalette="gray"
                            rounded="xl"
                            flex={1}
                            _hover={{ color: "white", bg: "red.500" }}
                          >
                            <FiLogOut />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button
                          asChild
                          rounded="xl"
                          colorPalette="gray"
                          flex={1}
                          onClick={() => setDrawerOpen(false)}
                        >
                          <Link href="/sign-in">Sign In</Link>
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </Drawer.Body>

                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
    </Flex>
  );
}
