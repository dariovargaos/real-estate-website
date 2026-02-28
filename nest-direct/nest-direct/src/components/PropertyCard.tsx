"use client";

import Link from "next/link";
import type { StaticImageData } from "next/image";

//icons
import { LuMapPin, LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";

import {
  Box,
  Image,
  Flex,
  Text,
  Heading,
  Badge,
  Icon,
  Button,
  Link as ChakraLink,
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
  tag?: string;
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
  // Static color values (customize as needed)
  const cardBg = "white";
  const cardShadow = "md";
  const hoverShadow = "xl";
  const borderColor = "gray.200";
  const muted = "gray.500";
  const foreground = "gray.900";

  return (
    <ChakraLink
      as={Link}
      href={`/property/${id}`}
      bg={cardBg}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={cardShadow}
      transition="all 0.3s"
      _hover={{
        boxShadow: hoverShadow,
        transform: "translateY(-4px)",
        textDecoration: "none",
      }}
      cursor="pointer"
      display="block"
      p={0}
      _focus={{ boxShadow: hoverShadow }}
    >
      {/* Image */}
      <Box position="relative" pb="75%" overflow="hidden">
        <Image
          src={image}
          alt={title}
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.5s"
          _groupHover={{ transform: "scale(1.05)" }}
          loading="lazy"
        />
        <Button
          aria-label="Add to favorites"
          position="absolute"
          top={3}
          right={3}
          h={9}
          w={9}
          bg={cardBg}
          opacity={0.8}
          borderRadius="full"
          backdropFilter="blur(4px)"
          _hover={{ bg: cardBg, opacity: 1 }}
        >
          <FaRegHeart size={16} color="black" />
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
          <Text fontFamily="serif" fontSize="2xl" color={foreground}>
            {price}
          </Text>
        </Flex>
        <Heading
          as="h3"
          fontWeight="semibold"
          color={foreground}
          fontSize="sm"
          mb={1}
        >
          {title}
        </Heading>
        <Flex align="center" gap={1} color={muted} fontSize="xs" mb={4}>
          <Icon>
            <LuMapPin size={14} />
          </Icon>
          <span>{location}</span>
        </Flex>

        {/* Features */}
        <Flex
          align="center"
          gap={4}
          pt={4}
          borderTop="1px"
          borderColor={borderColor}
        >
          <Flex align="center" gap={1.5} color={muted} fontSize="xs">
            <Icon>
              <LuBedDouble size={14} />
            </Icon>
            <span>{beds} Beds</span>
          </Flex>
          <Flex align="center" gap={1.5} color={muted} fontSize="xs">
            <Icon>
              <LuBath size={14} />
            </Icon>
            <span>{baths} Baths</span>
          </Flex>
          <Flex align="center" gap={1.5} color={muted} fontSize="xs">
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
