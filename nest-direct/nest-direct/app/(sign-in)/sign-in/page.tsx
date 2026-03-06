"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Stack,
  VStack,
  HStack,
  Input,
  Text,
  Heading,
  Separator,
  Field,
  IconButton,
} from "@chakra-ui/react";
import { FaHome, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Toaster, toaster } from "../../../components/ui/toaster";
import { supabase } from "../../../lib/supabase";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields");
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toaster.create({
          title: "Welcome back!",
          description: "You have successfully signed in.",
          type: "success",
        });

        // Clear form
        setEmail("");
        setPassword("");

        // Redirect to home page
        router.push("/");
      }
    } catch (error: any) {
      toaster.create({
        title: "Sign in failed",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toaster.create({
        title: "Google sign-in failed",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Flex minH="100vh">
      {/* Left — Branding Panel */}
      <Box
        display={{ base: "none", lg: "flex" }}
        w={{ lg: "50%" }}
        bg="hsl(220, 20%, 14%)"
        position="relative"
        alignItems="center"
        justifyContent="center"
        p={12}
      >
        <Box
          position="absolute"
          inset={0}
          background="linear-gradient(135deg, hsl(220, 20%, 14%), hsl(220, 20%, 14%), hsl(35, 80%, 56%, 0.2))"
        />
        <Box
          position="relative"
          zIndex={10}
          maxW="md"
          color="hsl(40, 33%, 98%)"
        >
          <Link href="/">
            <HStack mb={8}>
              <FaHome size={32} color="hsl(35, 80%, 56%)" />
              <Text fontFamily="serif" fontSize="2xl" color="hsl(40, 33%, 98%)">
                NestDirect
              </Text>
            </HStack>
          </Link>
          <Heading
            as="h1"
            fontFamily="DM Serif Display, serif"
            fontSize="4xl"
            lineHeight="tight"
            mb={6}
            color="hsl(40, 33%, 98%)"
            fontWeight="medium"
          >
            Welcome back to your property journey.
          </Heading>
          <Text color="hsl(40, 33%, 98%, 0.7)" fontSize="lg">
            Buy and sell properties directly — no agents, no hidden fees.
          </Text>
        </Box>
      </Box>

      {/* Right — Form */}
      <Flex flex={1} alignItems="center" justifyContent="center" p={8}>
        <Box w="full" maxW="md">
          <Stack gap={8}>
            <Box display={{ base: "block", lg: "none" }}>
              <Link href="/">
                <HStack mb={8}>
                  <FaHome size={24} color="#2D3748" />
                  <Text fontFamily="serif" fontSize="xl" color="gray.800">
                    NestDirect
                  </Text>
                </HStack>
              </Link>
            </Box>

            <Box>
              <Heading
                as="h2"
                fontFamily="DM Serif Display, serif"
                fontSize="3xl"
                color="gray.800"
                mb={2}
                fontWeight="medium"
              >
                Sign in
              </Heading>
              <Text color="gray.600">
                Enter your credentials to access your account.
              </Text>
            </Box>

            <Box as="form" onSubmit={handleSubmit}>
              <VStack gap={5}>
                <Field.Root required>
                  <Field.Label>Email address</Field.Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    rounded="xl"
                  />
                </Field.Root>

                <Field.Root required>
                  <Flex justify="space-between" w="100%" mb={2}>
                    <Field.Label>Password</Field.Label>
                    <Button
                      variant="plain"
                      size="xs"
                      color="hsl(35, 80%, 56%)"
                      _hover={{ color: "hsl(35, 80%, 66%)" }}
                      fontWeight="medium"
                    >
                      Forgot password?
                    </Button>
                  </Flex>
                  <Box position="relative" w="100%">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      pr={12}
                      rounded="xl"
                    />
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      position="absolute"
                      right={3}
                      top="50%"
                      transform="translateY(-50%)"
                      variant="ghost"
                      size="sm"
                      color="gray.600"
                      _hover={{ color: "gray.800" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </IconButton>
                  </Box>
                </Field.Root>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  colorPalette="gray"
                  rounded="xl"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </VStack>
            </Box>

            <Box position="relative">
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
              >
                <Separator w="full" />
              </Box>
              <Box position="relative" display="flex" justifyContent="center">
                <Text
                  bg="white"
                  px={2}
                  color="gray.600"
                  fontSize="xs"
                  textTransform="uppercase"
                >
                  or continue with
                </Text>
              </Box>
            </Box>

            <Button
              variant="outline"
              w="full"
              size="lg"
              rounded="xl"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <HStack>
                <FaGoogle size={20} />
                <Text>Continue with Google</Text>
              </HStack>
            </Button>

            <Text textAlign="center" fontSize="sm" color="gray.600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up">
                <Text
                  as="span"
                  color="hsl(35, 80%, 56%)"
                  fontWeight="semibold"
                  _hover={{ color: "hsl(35, 80%, 66%)" }}
                >
                  Create one
                </Text>
              </Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
      <Toaster />
    </Flex>
  );
};

export default SignIn;
