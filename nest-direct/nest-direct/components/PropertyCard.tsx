"use client";

import Link from "next/link";
import Image from "next/image";

//icons
import { LuMapPin, LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";

import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Icon,
  Button,
  Link as ChakraLink,
  Separator,
} from "@chakra-ui/react";

interface PropertyCardProps {
  id: string;
  image: string;
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  tag?: string | null;
}

const PropertyCard = ({
  id,
  image,
  price,
  title,
  location,
  beds,
  baths,
  sqft,
  tag,
}: PropertyCardProps) => {
  return (
    <ChakraLink
      as={Link}
      href={`/property/${id}`}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{
        boxShadow: "xl",
        transform: "translateY(-4px)",
        textDecoration: "none",
      }}
      cursor="pointer"
      display="block"
      p={0}
      _focus={{ boxShadow: "xl" }}
    >
      {/* Image */}
      <Box position="relative" pb="75%" overflow="hidden">
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          transition="transform 0.5s"
          _groupHover={{ transform: "scale(1.05)" }}
        >
          <Image
            src={image}
            alt={title}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Button
          aria-label="Add to favorites"
          position="absolute"
          bg="white"
          top={3}
          right={3}
          h={9}
          w={9}
          opacity={0.8}
          borderRadius="full"
          backdropFilter="blur(4px)"
          _hover={{ bg: "white", opacity: 1 }}
          role="group"
        >
          <Icon>
            <FaRegHeart size={14} color="black" />
          </Icon>
        </Button>
        {tag && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            bg="#E99E35"
            color="white"
            border="none"
            fontWeight="medium"
            fontSize="xs"
            zIndex={1}
          >
            {tag}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p={5}>
        <Flex align="start" justify="space-between" mb={2}>
          <Text
            fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
            fontSize="2xl"
          >
            {price}
          </Text>
        </Flex>
        <Heading as="h3" fontWeight="semibold" fontSize="sm" mb={1}>
          {title}
        </Heading>
        <Flex align="center" gap={1} color="gray.500" fontSize="xs" mb={4}>
          <Icon>
            <LuMapPin size={14} />
          </Icon>
          <span>{location}</span>
        </Flex>

        <Separator />

        {/* Features */}
        <Flex
          align="center"
          gap={4}
          pt={4}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
            <Icon>
              <LuBedDouble size={14} />
            </Icon>
            <span>{beds} Beds</span>
          </Flex>
          <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
            <Icon>
              <LuBath size={14} />
            </Icon>
            <span>{baths} Baths</span>
          </Flex>
          <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
            <Icon>
              <LuMaximize size={14} />
            </Icon>
            <span>{sqft}</span>
          </Flex>
        </Flex>
      </Box>
    </ChakraLink>
  );
};

export default PropertyCard;
