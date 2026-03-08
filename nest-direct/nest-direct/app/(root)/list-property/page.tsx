"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Box,
  Flex,
  Stack,
  Grid,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Icon,
  Field,
  NativeSelect,
  Separator,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";

//hooks
import { useUser } from "../../../hooks/useAuthContext";

//icons
import { FaEuroSign, FaCheckCircle } from "react-icons/fa";
import { LuHouse, LuMapPin } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ListProperty() {
  const [submitted, setSubmitted] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect to home if user is not authenticated (client-side protection)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    toaster.create({
      title: "Property submitted!",
      description: "We'll review your listing and publish it shortly.",
      type: "success",
      duration: 7000,
      closable: true,
    });
    setSubmitted(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (submitted) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Flex as="main" pt={16} justify="center" align="center">
          <Box px={4} py={24} textAlign="center" maxW="lg" mx="auto">
            <Flex
              align="center"
              justify="center"
              w={20}
              h={20}
              rounded="full"
              bg="green.100"
              color="green.500"
              mb={6}
              mx="auto"
            >
              <Icon>
                <FaCheckCircle size={24} />
              </Icon>
            </Flex>
            <Heading
              as="h1"
              fontFamily="serif"
              fontSize="4xl"
              color="gray.800"
              mb={4}
            >
              Listing Submitted!
            </Heading>
            <Text color="gray.500" mb={8}>
              Your property has been submitted for review. We&apos;ll notify you
              once it&apos;s live on the marketplace.
            </Text>
            <Button colorPalette="gray" onClick={() => setSubmitted(false)}>
              <Link href="/list-property">List Another Property</Link>
            </Button>
          </Box>
        </Flex>
        <Toaster />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="main" pt={16}>
        {/* Hero */}
        <Box py={16} bg="#F6F2EE">
          <Flex
            direction="column"
            gap={5}
            px={4}
            textAlign="center"
            maxW="2xl"
            mx="auto"
          >
            <Text
              color="#E99E35"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="widest"
              textTransform="uppercase"
              mb={2}
            >
              Sell Direct
            </Text>
            <Heading
              as="h1"
              fontFamily="DM Serif Display"
              fontSize={{ base: "4xl", md: "5xl" }}
              mb={4}
              fontWeight="thin"
            >
              List Your Property
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Skip the agents. Reach buyers directly and save thousands in
              commission fees.
            </Text>
          </Flex>
        </Box>

        {/* Benefits */}
        <Box py={12} bg="gray.50" borderBottom="1px" borderColor="gray.200">
          <Box px={4}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
              maxW="4xl"
              mx="auto"
              textAlign="center"
            >
              {[
                {
                  icon: FaEuroSign,
                  title: "Zero Commission",
                  desc: "Keep 100% of your sale price — no agent fees.",
                },
                {
                  icon: LuHouse,
                  title: "Full Control",
                  desc: "Manage your listing, photos, and pricing on your terms.",
                },
                {
                  icon: LuMapPin,
                  title: "Wide Reach",
                  desc: "Your property is seen by thousands of active buyers.",
                },
              ].map((b, i) => (
                <Flex key={i} direction="column" align="center">
                  <Flex
                    w={12}
                    h={12}
                    rounded="xl"
                    bg="#F9F1E4"
                    color="#E99E35"
                    align="center"
                    justify="center"
                    mb={3}
                  >
                    <Icon as={b.icon} boxSize={6} />
                  </Flex>
                  <Text
                    fontSize="lg"
                    color="gray.800"
                    mb={1}
                    fontWeight="semibold"
                  >
                    {b.title}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {b.desc}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Form */}
        <Box py={16} bg="gray.50">
          <Box px={4} maxW="2xl" mx="auto">
            <Heading
              as="h2"
              fontFamily="DM Serif Display"
              fontSize="3xl"
              mb={8}
              fontWeight="thin"
            >
              Property Details
            </Heading>
            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={6}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Property Title</Field.Label>
                    <Input
                      id="title"
                      placeholder="e.g. Modern Loft in Downtown"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Asking Price (€)</Field.Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="500000"
                      rounded="xl"
                    />
                  </Field.Root>
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Location</Field.Label>
                    <Input id="location" placeholder="City" rounded="xl" />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Property Type</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        placeholder="Select type"
                        borderRadius="xl"
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Bedrooms</Field.Label>
                    <Input
                      id="beds"
                      type="number"
                      placeholder="3"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Bathrooms</Field.Label>
                    <Input
                      id="baths"
                      type="number"
                      placeholder="2"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Size (m²)</Field.Label>
                    <Input
                      id="size_m2"
                      type="number"
                      placeholder="100"
                      rounded="xl"
                    />
                  </Field.Root>
                </Grid>

                <Field.Root required>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property — what makes it special?"
                    rows={5}
                    rounded="xl"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Photos</Field.Label>
                  <Box
                    border="1px dashed"
                    borderColor="gray.200"
                    rounded="xl"
                    p={8}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: "orange.300" }}
                    w="full"
                  >
                    <Icon
                      as={MdOutlineFileUpload}
                      boxSize={8}
                      color="gray.400"
                      mb={2}
                    />
                    <Text fontSize="sm" color="gray.500">
                      Drag & drop photos here, or click to browse
                    </Text>
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      Up to 20 photos · JPG, PNG · Max 10MB each
                    </Text>
                  </Box>
                </Field.Root>

                <Separator />
                <Box>
                  <Heading
                    as="h3"
                    fontFamily="DM Serif Display"
                    fontWeight="thin"
                    fontSize="xl"
                    mb={4}
                  >
                    Your Contact Info
                  </Heading>
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    <Field.Root required>
                      <Field.Label>Full Name</Field.Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        type="text"
                        rounded="xl"
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>Phone Number</Field.Label>
                      <Input
                        id="phone"
                        placeholder="0912345678"
                        type="tel"
                        rounded="xl"
                      />
                    </Field.Root>
                  </Grid>
                </Box>

                <Button
                  type="submit"
                  colorScheme="gray"
                  size="lg"
                  borderRadius="xl"
                >
                  Submit Listing
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
