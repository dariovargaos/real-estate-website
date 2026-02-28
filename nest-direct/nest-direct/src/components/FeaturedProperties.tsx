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

//components
import PropertyCard from "@/components/PropertyCard";

//dummy data
import { properties } from "@/data/properties";

export default function FeaturedProperties() {
  return (
    <Box as="section" id="properties" py={{ base: 24 }} bg="background">
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
              color="secondary"
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
              fontFamily="serif"
              fontSize={{ base: "4xl", md: "5xl" }}
              color="foreground"
            >
              Featured Properties
            </Heading>
          </Box>
          <ChakraLink
            as={Link}
            href="#"
            display={{ base: "none", md: "inline-flex" }}
            fontSize="sm"
            fontWeight="medium"
            color="muted-foreground"
            _hover={{ color: "foreground" }}
            transition="colors 0.2s"
            textDecoration="underline"
            textUnderlineOffset={4}
          >
            View all listings →
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
