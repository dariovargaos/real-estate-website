"use client";

import Link from "next/link";

import {
  Box,
  Flex,
  Text,
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  List,
} from "@chakra-ui/react";

import { Link as ChakraLink } from "@chakra-ui/react";

//icons
import { LuHouse } from "react-icons/lu";

const columns = [
  {
    title: "Links",
    links: [
      { label: "Browse Listings", href: "/properties" },
      { label: "List Property", href: "/list-property" },
      { label: "Premium", href: "/premium" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Real Estates",
    links: [
      { label: "Apartments", href: "/properties?type=apartment" },
      { label: "Houses", href: "/properties?type=house" },
      { label: "Office Space", href: "/properties?type=office" },
      { label: "Land", href: "/properties?type=land" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Adresa", href: "/adresa" },
      { label: "Telefon", href: "/telefon" },
    ],
  },
];

export default function Footer() {
  return (
    <Flex
      direction="column"
      bg="#1D212B"
      p={10}
      align="center"
      justify="center"
      gap="180px"
    >
      <Container maxW="container.xl" px={4}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={8}
          mb={12}
        >
          <GridItem colSpan={{ base: 2, md: 1 }}>
            <Flex align="center" gap={2} mb={4}>
              <Icon size="lg" color="#E99E35">
                <LuHouse />
              </Icon>
              <Text fontFamily="serif" fontSize="lg" color="background">
                NestDirect
              </Text>
            </Flex>
            <Text color="gray.400" fontSize="sm" lineHeight="relaxed">
              The peer-to-peer marketplace connecting buyers and sellers
              directly.
            </Text>
          </GridItem>
          {columns.map((col) => (
            <Box key={col.title}>
              <Heading
                as="h4"
                fontFamily="serif"
                color="background"
                fontSize="md"
                mb={4}
              >
                {col.title}
              </Heading>
              <List.Root variant="plain" gap={2}>
                {col.links.map((link) => (
                  <List.Item key={link.label}>
                    <ChakraLink
                      as={Link}
                      href={link.href}
                      color="gray.500"
                      fontSize="sm"
                      _hover={{
                        color: "#B9B9BB",
                        textDecoration: "none",
                      }}
                      _focus={{ boxShadow: "none", outline: "none" }}
                      _active={{ boxShadow: "none", outline: "none" }}
                    >
                      {link.label}
                    </ChakraLink>
                  </List.Item>
                ))}
              </List.Root>
            </Box>
          ))}
        </Grid>

        <Box
          pt={8}
          textAlign="center"
          borderTop="1px solid"
          borderColor="gray.700"
        >
          <Text color="gray.500" fontSize="xs">
            © 2026 NestDirect. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Flex>
  );
}
