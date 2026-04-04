"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// hooks
import {
  useSellerProfile,
  useSellerProperties,
} from "../../../../hooks/useProfile";

//utils
import { formatMemberSince } from "../../../../lib/utils";

// Chakra components
import {
  Box,
  Flex,
  VStack,
  HStack,
  Grid,
  GridItem,
  Text,
  Heading,
  Badge,
  Spinner,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";

// Icons
import { FaArrowLeft, FaRegCalendarAlt, FaPhone, FaStar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";

// Components
import PropertyCard from "../../../../components/PropertyCard";

export default function UserProfile() {
  const params = useParams();
  const userId = params.id as string;

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useSellerProfile(userId);

  const { data: properties, isLoading: propertiesLoading } =
    useSellerProperties(userId);

  const isLoading = profileLoading || propertiesLoading;

  if (isLoading) {
    return (
      <Flex minH="100vh" direction="column">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <VStack textAlign="center">
            <Spinner size="xl" color="hsl(35, 80%, 56%)" />
            <Text mt={4} color="gray.600">
              Loading profile...
            </Text>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  // If no profile AND no properties, the user doesn't exist
  if (profileError && (!properties || properties.length === 0)) {
    return (
      <Flex minH="100vh" direction="column">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <VStack textAlign="center">
            <Heading
              as="h1"
              fontFamily="DM Serif Display, serif"
              fontSize="4xl"
              fontWeight="medium"
              mb={4}
            >
              User not found
            </Heading>
            <Text color="gray.600" mb={4}>
              This seller profile could not be found.
            </Text>

            <Button asChild colorPalette="gray">
              <Link href="/properties">
                <FaArrowLeft
                  style={{ marginRight: 8, width: 16, height: 16 }}
                />
                Back to Properties
              </Link>
            </Button>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  const totalListings = properties?.length || 0;

  // Derive seller info — prefer profile data, fall back to property data
  const sellerName =
    profile?.full_name || properties?.[0]?.seller_name || "Property Owner";
  const sellerPhone = profile?.phone || properties?.[0]?.seller_phone || null;
  const sellerSince =
    profile?.created_at ||
    properties?.[0]?.seller_since ||
    new Date().toISOString();

  // Calculate years active
  const memberYear = new Date(sellerSince).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - memberYear;
  const activeLabel =
    yearsActive < 1
      ? "< 1 yr"
      : `${yearsActive} yr${yearsActive > 1 ? "s" : ""}`;

  return (
    <Box minH="100vh">
      <Box as="main" pt={24} pb={16}>
        {/* Back link */}
        <Box maxW="container.xl" mx="auto" px={4} mb={6}>
          <Link
            href="/properties"
            style={{ width: "fit-content", display: "inline-flex" }}
          >
            <HStack
              gap={1.5}
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "gray.900" }}
              transition="colors 0.2s"
            >
              <FaArrowLeft size={16} />
              <Text>Back to properties</Text>
            </HStack>
          </Link>
        </Box>

        <Box maxW="container.xl" mx="auto" px={4}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={10}>
            {/* Left: Seller Info Card */}
            <GridItem>
              <Box
                bg="white"
                rounded="2xl"
                p={8}
                shadow="lg"
                border="1px"
                borderColor="gray.200"
                position="sticky"
                top={28}
              >
                {/* Avatar */}
                <Flex
                  direction="column"
                  alignItems="center"
                  textAlign="center"
                  mb={6}
                >
                  <Flex
                    h={24}
                    w={24}
                    rounded="full"
                    bg="gray.100"
                    alignItems="center"
                    justifyContent="center"
                    mb={4}
                  >
                    <FiUser size={40} color="#9CA3AF" />
                  </Flex>
                  <Heading
                    as="h1"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={1}
                  >
                    {sellerName}
                  </Heading>
                  <Badge
                    mt={1}
                    bg="hsl(35, 80%, 56%)"
                    color="white"
                    rounded="full"
                  >
                    Property Owner
                  </Badge>
                </Flex>

                {/* Stats */}
                <Grid templateColumns="1fr 1fr" gap={4} mb={6}>
                  <Box bg="gray.100" rounded="xl" p={4} textAlign="center">
                    <Flex justifyContent="center" mb={1.5}>
                      <LuHouse size={20} color="hsl(35, 80%, 56%)" />
                    </Flex>
                    <Text fontFamily="DM Serif Display, serif" fontSize="2xl">
                      {totalListings}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {totalListings === 1 ? "Listing" : "Listings"}
                    </Text>
                  </Box>
                  <Box bg="gray.100" rounded="xl" p={4} textAlign="center">
                    <Flex justifyContent="center" mb={1.5}>
                      <FaRegCalendarAlt size={20} color="hsl(35, 80%, 56%)" />
                    </Flex>
                    <Text fontFamily="DM Serif Display, serif" fontSize="2xl">
                      {activeLabel}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Active
                    </Text>
                  </Box>
                </Grid>

                {/* Details */}
                <VStack
                  gap={3}
                  borderTop="1px"
                  borderColor="gray.200"
                  pt={5}
                  alignItems="stretch"
                >
                  <HStack gap={3} fontSize="sm" color="gray.500">
                    <Box flexShrink={0}>
                      <FaRegCalendarAlt size={16} />
                    </Box>
                    <Text>{formatMemberSince(sellerSince)}</Text>
                  </HStack>
                  {sellerPhone && (
                    <HStack gap={3} fontSize="sm" color="gray.500">
                      <Box flexShrink={0}>
                        <FaPhone size={16} color="gray.500" />
                      </Box>
                      <ChakraLink
                        href={`tel:${sellerPhone}`}
                        color="gray.500"
                        _hover={{
                          textDecoration: "underline",
                          color: "gray.700",
                        }}
                      >
                        {sellerPhone}
                      </ChakraLink>
                    </HStack>
                  )}
                  <HStack gap={3} fontSize="sm" color="gray.500">
                    <Box flexShrink={0}>
                      <FaStar size={16} color="gray.500" />
                    </Box>
                    <Text>Verified Seller</Text>
                  </HStack>
                </VStack>
              </Box>
            </GridItem>

            {/* Right: Seller's Listings */}
            <GridItem>
              <Heading
                as="h2"
                fontFamily="DM Serif Display, serif"
                fontSize="2xl"
                fontWeight="medium"
                mb={6}
              >
                {sellerName}&apos;s Listings
              </Heading>
              {totalListings === 0 ? (
                <Box
                  bg="gray.50"
                  rounded="2xl"
                  p={10}
                  textAlign="center"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Flex justifyContent="center" mb={3}>
                    <LuHouse size={40} color="#9CA3AF" />
                  </Flex>
                  <Text color="gray.500">No active listings at this time.</Text>
                </Box>
              ) : (
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={6}
                >
                  {properties?.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      image={property.image}
                      price={property.price}
                      title={property.title}
                      location={property.location}
                      rooms={property.rooms}
                      baths={property.baths}
                      size_m2={property.size_m2}
                      tag={property.tag}
                      type={property.type}
                    />
                  ))}
                </Grid>
              )}
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
