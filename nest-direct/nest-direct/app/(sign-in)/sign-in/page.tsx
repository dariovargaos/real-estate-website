"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//form validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//chakra components
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
import { Toaster, toaster } from "../../../components/ui/toaster";

//icons
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { LuHouse } from "react-icons/lu";

import { supabase } from "../../../lib/supabase";

const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user) {
        toaster.create({
          title: "Welcome back!",
          description: "You have successfully signed in.",
          type: "success",
        });

        reset();
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

      if (error) throw error;
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
              <LuHouse size={32} color="hsl(35, 80%, 56%)" />
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
                  <LuHouse size={24} color="hsl(35, 80%, 56%)" />
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

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={5}>
                <Field.Root required invalid={!!errors.email}>
                  <Field.Label>Email address</Field.Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    size="lg"
                    rounded="xl"
                  />
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!errors.password}>
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
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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
                  <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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
