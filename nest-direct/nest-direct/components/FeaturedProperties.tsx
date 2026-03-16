"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const { data: properties, isLoading: loading, error } = useListedProperties();
  //mozda poslije dodati da vuce iz baze samo premium i elite a ne sve i onda samo shuffle tih,
  // ali ovo je ok za sada jer se ionako vrti svake 3 minute i nema puno podataka,
  // a kasnije kad bude bilo vise onda optimizirati sa queryem koji vuce samo premium i elite

  // Filter premium and elite properties
  const premiumEliteProperties = useMemo(() => {
    return (
      properties?.filter(
        (property) =>
          property.tag?.toLowerCase() === "premium" ||
          property.tag?.toLowerCase() === "elite",
      ) || []
    );
  }, [properties]);

  // Use TanStack Query to manage featured properties rotation
  const { data: featuredProperties } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => {
      if (premiumEliteProperties.length === 0) return [];

      // Calculate current rotation slot inside queryFn (allowed here)
      const currentRotationSlot = Math.floor(Date.now() / (3 * 60 * 1000));

      // Shuffle properties based on the rotation slot for deterministic randomness
      const shuffledProperties = premiumEliteProperties
        .map((property, index) => ({
          property,
          sortKey: Math.sin((index + currentRotationSlot) * 2.5), // Deterministic shuffle
        }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map((item) => item.property);

      // Remove duplicates and take first 9
      const uniqueProperties = [];
      const usedIds = new Set();

      for (const property of shuffledProperties) {
        if (!usedIds.has(property.id) && uniqueProperties.length < 9) {
          uniqueProperties.push(property);
          usedIds.add(property.id);
        }
      }

      return uniqueProperties;
    },
    enabled: !!premiumEliteProperties.length, // Only run when we have properties
    staleTime: 3 * 60 * 1000, // Consider data stale after 3 minutes
    refetchInterval: 3 * 60 * 1000, // Auto-refetch every 3 minutes
    refetchIntervalInBackground: true, // Continue rotation even when tab is not active
  });

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement || hasEnteredView) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [hasEnteredView]);

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
            <Text color="gray.500">{error.message}</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      ref={sectionRef}
      as="section"
      id="properties"
      py={{ base: 24 }}
      bg="#FCFAF8"
    >
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

        {featuredProperties && featuredProperties.length > 0 ? (
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
                opacity={0}
                animation={hasEnteredView ? "fadeInUp 0.7s forwards" : "none"}
                style={{
                  animationDelay: `${index * 0.08}s`,
                }}
              >
                <PropertyCard {...property} />
              </Box>
            ))}
          </Grid>
        ) : (
          <VStack textAlign="center" py={12}>
            <Text color="gray.600" fontSize="lg">
              No premium or elite properties available
            </Text>
            <Text color="gray.500" fontSize="sm">
              Check back later for premium listings
            </Text>
          </VStack>
        )}
      </Container>
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
