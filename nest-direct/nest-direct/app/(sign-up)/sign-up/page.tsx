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
import { FaHome, FaEye, FaEyeSlash, FaGoogle, FaCheck } from "react-icons/fa";
import { Toaster, toaster } from "../../../components/ui/toaster";
import { supabase } from "../../../lib/supabase";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toaster.create({
          title: "Account created successfully!",
          description: data.user.email_confirmed_at
            ? "You can now sign in to your account."
            : "Please check your email to verify your account before signing in.",
          type: "success",
          duration: 6000,
        });

        // Clear form
        setFullName("");
        setEmail("");
        setPassword("");

        // Redirect to sign-in page after a delay
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      }
    } catch (error: any) {
      toaster.create({
        title: "Sign up failed",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
        title: "Google sign-up failed",
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
            Start your real estate journey with NestDirect
          </Heading>
          <Text color="hsl(40, 33%, 98%, 0.7)" fontSize="lg">
            Join thousands of buyers and sellers transacting directly with each
            other - no middlemen, no hidden fees.
          </Text>
          <VStack gap={3} pt={4} alignItems="flex-start">
            {[
              "No agent commissions",
              "Direct buyer-seller connection",
              "Secure & transparent process",
            ].map((item) => (
              <HStack key={item} gap={3}>
                <Box
                  h={6}
                  w={6}
                  rounded="full"
                  bg="hsl(35, 80%, 56%, 0.2)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaCheck size={14} color="hsl(35, 80%, 56%)" />
                </Box>
                <Text color="hsl(40, 33%, 98%, 0.8)" fontSize="sm">
                  {item}
                </Text>
              </HStack>
            ))}
          </VStack>
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
                fontWeight="medium"
                color="gray.800"
                mb={2}
              >
                Create an account
              </Heading>
              <Text color="gray.600">
                Get started in under a minute - completely free.
              </Text>
            </Box>

            <Box as="form" onSubmit={handleSubmit}>
              <VStack gap={5}>
                <Field.Root required>
                  <Field.Label>Full name</Field.Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    size="lg"
                    rounded="xl"
                  />
                </Field.Root>

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
                  {isLoading ? "Creating Account..." : "Create Account"}
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
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <HStack>
                <FaGoogle size={20} />
                <Text>Continue with Google</Text>
              </HStack>
            </Button>

            <Text textAlign="center" fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Link href="/sign-in">
                <Text
                  as="span"
                  color="hsl(35, 80%, 56%)"
                  fontWeight="semibold"
                  _hover={{ color: "hsl(35, 80%, 66%)" }}
                >
                  Sign in
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

export default SignUp;
