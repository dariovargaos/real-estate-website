"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// icons
import {
  LuMapPin,
  LuBedDouble,
  LuBath,
  LuMaximize,
  LuHouse,
} from "react-icons/lu";
import { FaRegHeart, FaHeart, FaRegBuilding } from "react-icons/fa";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { GiField } from "react-icons/gi";

// hooks
import { useUser } from "../hooks/useAuthContext";
import { useUserFavorites } from "../hooks/useProfile";

// components
import { toaster } from "./ui/toaster";

import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Icon,
  Button,
  Card,
  Separator,
} from "@chakra-ui/react";

interface PropertyCardProps {
  id: string;
  image: string;
  price: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  size_m2: string;
  type?: string | null;
  tag?: string | null;
}

const typeIconMap: Record<string, React.ReactElement> = {
  house: <LuHouse size={14} />,
  apartment: <PiBuildingApartmentBold size={14} />,
  office_space: <FaRegBuilding size={14} />,
  land: <GiField size={14} />,
};

const PropertyCard = ({
  id,
  image,
  price,
  title,
  location,
  beds,
  baths,
  size_m2,
  type,
  tag,
}: PropertyCardProps) => {
  const { user } = useUser();
  const { favorites, addToFavorites, removeFromFavorites } = useUserFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorited(false);
    } else if (favorites) {
      setIsFavorited(favorites.some((fav) => fav.property.id === id));
    }
  }, [favorites, id, user]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const isElite = tag?.toLowerCase() === "elite";
  const isPremium = tag?.toLowerCase() === "premium";
  const isFeatured = tag?.toLowerCase() === "featured";

  const tagBorderColor = isElite
    ? "#FFD400"
    : isPremium
      ? "#E85D04"
      : isFeatured
        ? "#F77F00"
        : "gray.500";

  const tagBadgeColor = isElite
    ? "#FFD400"
    : isPremium
      ? "#E85D04"
      : isFeatured
        ? "#F77F00"
        : "#E99E35";

  return (
    <Card.Root
      asChild
      overflow="hidden"
      border={`${isElite ? "4px" : isPremium || isFeatured ? "2px" : "1px"} solid ${tagBorderColor}`}
      transition="all 0.3s"
      _hover={{
        boxShadow: isElite ? "0 0 100px rgba(232, 218, 13, 0.3)" : "xl",
        transform: "translateY(-4px)",
      }}
      cursor="pointer"
      textDecoration="none"
      _focus={{ boxShadow: "xl" }}
    >
      <Link href={`/property/${id}`}>
        {/* Image */}
        <Box position="relative" pb="75%" overflow="hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
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
              bg={tagBadgeColor}
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
        <Card.Body bg={isElite ? "#f1eac7" : "white"} gap={0}>
          <Text
            fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
            fontSize="2xl"
            mb={2}
          >
            {`€${price.toLocaleString()}`}
          </Text>
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
          <Flex align="center" gap={4} pt={4} flexWrap="wrap">
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
            {type && (
              <Flex align="center" gap={1.5} color="gray.500" fontSize="xs">
                <Icon>
                  {typeIconMap[type.toLowerCase()] ?? <LuHouse size={14} />}
                </Icon>
                <span>{type}</span>
              </Flex>
            )}
          </Flex>
        </Card.Body>
      </Link>
    </Card.Root>
  );
};

export default PropertyCard;
