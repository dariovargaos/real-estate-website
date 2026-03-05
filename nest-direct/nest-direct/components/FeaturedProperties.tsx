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
} from "@chakra-ui/react";

//react icons
import { FaArrowRight } from "react-icons/fa";

//components
import PropertyCard from "./PropertyCard";

//dummy data
import { properties } from "../data/properties";

export default function FeaturedProperties() {
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
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {properties.map((property, index) => (
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
      </Container>
    </Box>
  );
}
