"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

//icons
import { LuMapPin, LuBedDouble, LuBath, LuMaximize } from "react-icons/lu";
import { FaRegHeart, FaHeart } from "react-icons/fa";

//hooks
import { useUser } from "../hooks/useAuthContext";
import { useUserFavorites } from "../hooks/useProfile";

//components
import { toaster } from "./ui/toaster";

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
  size_m2: string;
  type?: string | null;
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
  size_m2,
  // type, // Keep for future use but not currently displayed
  tag,
}: PropertyCardProps) => {
  const { user } = useUser();
  const { favorites, addToFavorites, removeFromFavorites } = useUserFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if this property is in the user's favorites
  useEffect(() => {
    if (!user) {
      // If user is not logged in, reset favorites state
      setIsFavorited(false);
    } else if (favorites) {
      // If user is logged in and favorites are loaded, check if property is favorited
      const favorited = favorites.some((fav) => fav.property.id === id);
      setIsFavorited(favorited);
    }
    // Note: If user exists but favorites are still loading, we don't update the state
  }, [favorites, id, user]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!user) {
      toaster.create({
        title: "Sign in required",
        description: "Please sign in to save properties to your favorites.",
        type: "warning",
      });
      return;
    }

    setIsToggling(true);
    try {
      if (isFavorited) {
        const result = await removeFromFavorites(id);
        if (result.success) {
          setIsFavorited(false);
          toaster.create({
            title: "Removed from favorites",
            description: `${title} has been removed from your favorites.`,
            type: "success",
          });
        }
      } else {
        const result = await addToFavorites(id);
        if (result.success) {
          setIsFavorited(true);
          toaster.create({
            title: "Added to favorites",
            description: `${title} has been saved to your favorites.`,
            type: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toaster.create({
        title: "Something went wrong",
        description: "Unable to update favorites. Please try again.",
        type: "error",
      });
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <ChakraLink
      as={Link}
      href={`/property/${id}`}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="md"
      border={
        tag?.toLowerCase() === "elite"
          ? "4px solid #FFD400" // Gold border for Elite
          : tag?.toLowerCase() === "premium"
            ? "2px solid #E85D04" // Dark orange border for Premium
            : tag?.toLowerCase() === "featured"
              ? "2px solid #F77F00" // Orange border for Featured
              : "1px solid transparent" // Default transparent border
      }
      transition="all 0.3s"
      _hover={{
        boxShadow:
          tag?.toLowerCase() === "elite"
            ? "0 0 100px rgba(232, 218, 13, 0.3)"
            : "xl",
        transform: "translateY(-4px)",
        textDecoration: "none",
        borderColor:
          tag?.toLowerCase() === "elite"
            ? "#FFD400"
            : tag?.toLowerCase() === "premium"
              ? "#E85D04"
              : tag?.toLowerCase() === "featured"
                ? "#F77F00"
                : "gray.200",
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
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          position="absolute"
          bg="white"
          top={3}
          right={3}
          h={9}
          w={9}
          opacity={0.9}
          borderRadius="full"
          backdropFilter="blur(4px)"
          _hover={{ bg: "white", opacity: 1, transform: "scale(1.1)" }}
          onClick={handleToggleFavorite}
          disabled={isToggling}
          transition="all 0.2s"
          role="group"
        >
          <Icon>
            {isFavorited ? (
              <FaHeart size={14} color="red" />
            ) : (
              <FaRegHeart size={14} color="black" />
            )}
          </Icon>
        </Button>
        {tag && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            bg={
              tag.toLowerCase() === "elite"
                ? "#FFD400"
                : tag.toLowerCase() === "premium"
                  ? "#E85D04"
                  : tag.toLowerCase() === "featured"
                    ? "#F77F00"
                    : "#E99E35"
            }
            color="white"
            fontWeight="medium"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            textTransform="uppercase"
            letterSpacing="wider"
            zIndex={1}
          >
            {tag}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p={5} bg={tag?.toLowerCase() === "elite" ? "#f1eac7" : "white"}>
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
            <span>{beds} Bedrooms</span>
          </Flex>
          <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
            <Icon>
              <LuBath size={14} />
            </Icon>
            <span>{baths} Bathrooms</span>
          </Flex>
          <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
            <Icon>
              <LuMaximize size={14} />
            </Icon>
            <span>{size_m2} m²</span>
          </Flex>
        </Flex>
      </Box>
    </ChakraLink>
  );
};

export default PropertyCard;
