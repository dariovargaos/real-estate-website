"use client";

import Link from "next/link";

//hooks
import { useUser } from "../hooks/useAuthContext";

//components
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { toaster } from "./ui/toaster";

//react icons
import { FaArrowRight } from "react-icons/fa";

export default function CTASection() {
  const { user } = useUser();

  const handleListPropertyClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toaster.create({
        title: "Sign in required",
        description: "You need to sign in to list your property.",
        type: "warning",
        duration: 5000,
      });
    }
  };
  return (
    <Flex direction="column" bg="#1D212B" p={10} maxH="500px">
      <Flex direction="column" align="center" justify="center" gap={5}>
        <Text color="white" fontSize="5xl" fontFamily="serif">
          Ready to Buy or Sell?
        </Text>
        <Box maxW="500px">
          <Text color="gray.400" wordWrap="break-word" textAlign="center">
            {" "}
            Join thousands of homeowners who are saving money by dealing
            directly.
          </Text>
        </Box>

        <Flex gap={5} mt={5} mb={5}>
          <Button
            asChild
            bg="#E99E35"
            rounded="xl"
            size="xl"
            _hover={{
              bg: "#bc802d",
            }}
          >
            <Link href="/properties">
              Browse Properties{" "}
              <Icon size="xs">
                <FaArrowRight />
              </Icon>
            </Link>
          </Button>

          <Button
            asChild
            bg="transparent"
            borderColor="gray.500"
            size="xl"
            rounded="xl"
            _hover={{
              bg: "whiteAlpha.300",
            }}
          >
            <Link href="/list-property" onClick={handleListPropertyClick}>
              List Your Home
            </Link>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
