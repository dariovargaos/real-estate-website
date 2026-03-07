"use client";

import Link from "next/link";

import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  Link as ChakraLink,
  Container,
  VStack,
  Spinner,
} from "@chakra-ui/react";

//react icons
import { FaArrowRight } from "react-icons/fa";

//components
import PropertyCard from "./PropertyCard";

//hooks
import { useListedProperties } from "../hooks/useListedProperties";

export default function FeaturedProperties() {
  const { properties, loading, error } = useListedProperties();

  // Show only first 6 properties or featured ones
  const featuredProperties = properties?.slice(0, 6) || [];

  if (loading) {
    return (
      <Box as="section" id="properties" py={{ base: 24 }} bg="#FCFAF8">
        <Container maxW="container.xl" px={4}>
          <VStack gap={4}>
            <Spinner size="lg" color="#E99E35" />
            <Text color="gray.600">Loading featured properties...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box as="section" id="properties" py={{ base: 24 }} bg="#FCFAF8">
        <Container maxW="container.xl" px={4}>
          <VStack gap={4}>
            <Text color="red.500" fontSize="lg">
              Failed to load properties
            </Text>
            <Text color="gray.500">{error}</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box as="section" id="properties" py={{ base: 24 }} bg="#FCFAF8">
      <Container maxW="container.xl" px={4}>
        <Flex
          align="flex-end"
          justify="space-between"
          mb={12}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 8, md: 0 }}
        >
          <Box>
            <Text
              color="#E99E35"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="widest"
              textTransform="uppercase"
              mb={2}
            >
              Explore
            </Text>
            <Heading
              as="h2"
              fontFamily="DM Serif Display, serif"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="thin"
            >
              Featured Properties
            </Heading>
          </Box>
          <ChakraLink
            as={Link}
            href="/properties"
            display={{ base: "none", md: "inline-flex" }}
            fontSize="sm"
            color="gray.500"
            _hover={{ color: "gray.700" }}
            textDecoration="underline"
            textUnderlineOffset={4}
          >
            View all listings <FaArrowRight />
          </ChakraLink>
        </Flex>
        
        {featuredProperties.length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {featuredProperties.map((property, index) => (
              <Box
                key={property.id}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <PropertyCard {...property} />
              </Box>
            ))}
          </Grid>
        ) : (
          <VStack textAlign="center" py={12}>
            <Text color="gray.600" fontSize="lg">
              No properties available
            </Text>
            <Text color="gray.500" fontSize="sm">
              Check back later for new listings
            </Text>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
