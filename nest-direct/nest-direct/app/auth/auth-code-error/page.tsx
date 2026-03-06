"use client";

import Link from "next/link";
import { Box, Button, Flex, VStack, Text, Heading } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";

export default function AuthCodeError() {
  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center" p={8}>
      <Box w="full" maxW="md" textAlign="center">
        <VStack gap={6}>
          <Box>
            <Heading
              as="h1"
              fontFamily="DM Serif Display, serif"
              fontSize="2xl"
              fontWeight="medium"
              color="red.600"
              mb={2}
            >
              Authentication Error
            </Heading>
            <Text color="gray.600">
              Sorry, there was an error during the authentication process.
              Please try signing up again.
            </Text>
          </Box>

          <VStack gap={3} w="full">
            <Link href="/sign-up">
              <Button w="full" size="lg" colorPalette="gray" rounded="xl">
                Try Sign Up Again
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" w="full" size="lg" rounded="xl">
                <FaHome />
                <Text>Back to Home</Text>
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}
