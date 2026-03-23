"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
import { useFeaturedProperties } from "../hooks/useProperties";

export default function FeaturedProperties() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const {
    data: allFeaturedProperties,
    isLoading: loading,
    error,
  } = useFeaturedProperties();

  const [rotationSlot, setRotationSlot] = useState(0);

  // Update rotation slot every 3 minutes
  useEffect(() => {
    const update = () =>
      setRotationSlot(Math.floor(Date.now() / (3 * 60 * 1000)));
    update();
    const interval = setInterval(update, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Shuffle all fetched properties based on the current rotation slot, deduplicate, take 9
  const featuredProperties = useMemo(() => {
    if (!allFeaturedProperties?.length) return [];

    const shuffled = [...allFeaturedProperties]
      .map((property, index) => ({
        property,
        sortKey: Math.sin((index + 1) * (rotationSlot + 1) * 2.5),
      }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((item) => item.property);

    const seen = new Set<string>();
    const unique: typeof shuffled = [];
    for (const p of shuffled) {
      if (!seen.has(p.id) && unique.length < 9) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    return unique;
  }, [allFeaturedProperties, rotationSlot]);

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

  return (
    <Box
      ref={sectionRef}
      as="section"
      id="properties"
      py={{ base: 24 }}
      bg="#FCFAF8"
    >
      <Container maxW="container.xl" px={4}>
        {loading ? (
          <VStack gap={4}>
            <Spinner size="lg" color="#E99E35" />
            <Text color="gray.600">Loading featured properties...</Text>
          </VStack>
        ) : error ? (
          <VStack gap={4}>
            <Text color="red.500" fontSize="lg">
              Failed to load properties
            </Text>
            <Text color="gray.500">{error.message}</Text>
          </VStack>
        ) : (
          <>
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
                    animation={
                      hasEnteredView ? "fadeInUp 0.7s forwards" : "none"
                    }
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
          </>
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
