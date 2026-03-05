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
  Separator,
} from "@chakra-ui/react";

import { Link as ChakraLink } from "@chakra-ui/react";

//icons
import { LuHouse } from "react-icons/lu";

export default function Footer() {
  const columns = [
    {
      title: "Marketplace",
      links: ["Browse Listings", "Sell Property", "Pricing", "How It Works"],
    },
    { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
    {
      title: "Support",
      links: ["Help Center"],
    },
  ];
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
              <Box>
                {col.links.map((link) => (
                  <ChakraLink
                    key={link}
                    as={Link}
                    href="#"
                    color="gray.500"
                    fontSize="sm"
                    _hover={{
                      color: "#B9B9BB",
                      textDecoration: "none",
                    }}
                    _focus={{ boxShadow: "none", outline: "none" }}
                    _active={{ boxShadow: "none", outline: "none" }}
                    display="block"
                    mb={2}
                  >
                    {link}
                  </ChakraLink>
                ))}
                <ChakraLink
                  as={Link}
                  href="/contact"
                  color="gray.500"
                  fontSize="sm"
                  _hover={{ color: "gray.400", textDecoration: "none" }}
                  _focus={{ boxShadow: "none", outline: "none" }}
                  _active={{ boxShadow: "none", outline: "none" }}
                  display="block"
                  mb={2}
                >
                  Contact
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  href="/privacy-policy"
                  color="gray.500"
                  fontSize="sm"
                  _hover={{ color: "gray.400", textDecoration: "none" }}
                  _focus={{ boxShadow: "none", outline: "none" }}
                  _active={{ boxShadow: "none", outline: "none" }}
                  display="block"
                  mb={2}
                >
                  Privacy Policy
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  href="/terms-of-service"
                  color="gray.500"
                  fontSize="sm"
                  _hover={{ color: "gray.400", textDecoration: "none" }}
                  _focus={{ boxShadow: "none", outline: "none" }}
                  _active={{ boxShadow: "none", outline: "none" }}
                  display="block"
                  mb={2}
                >
                  Terms of Service
                </ChakraLink>
              </Box>
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
