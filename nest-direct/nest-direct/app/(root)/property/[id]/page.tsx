"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

//lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

//hooks
import { useProperty } from "../../../../hooks/useProperty";
import { useUser } from "../../../../hooks/useAuthContext";
import { useUserFavorites } from "../../../../hooks/useProfile";

//api and utils
import { sendContactMessage } from "../../../../lib/api";
import { formatMemberSince } from "../../../../lib/utils";

//chakra components
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  Heading,
  IconButton,
  Textarea,
  VStack,
  HStack,
  AspectRatio,
  Badge,
  Field,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";

//react-icons
import {
  FaArrowLeft,
  FaBed,
  FaBath,
  FaExpand,
  FaMapMarkerAlt,
  FaRegHeart,
  FaHeart,
  FaShare,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaPaperPlane,
  FaMap,
} from "react-icons/fa";
import { Toaster, toaster } from "../../../../components/ui/toaster";

const PropertyDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: property, isLoading: loading, error } = useProperty(id);
  const { user } = useUser();
  const { favorites, addToFavorites, removeFromFavorites } = useUserFavorites();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Sync favorites state with the hook data
  useEffect(() => {
    if (!user) {
      // If user is not logged in, reset favorites state
      setIsFavorited(false);
    } else if (favorites && property) {
      // If user is logged in and favorites are loaded, check if property is favorited
      const favorited = favorites.some(
        (fav) => fav.property?.id === property.id,
      );
      setIsFavorited(favorited);
    }
    // Note: If user exists but favorites are still loading, we don't update the state
  }, [favorites, property?.id, user]);

  // Handle favorites toggle with immediate UI feedback
  const handleFavoriteToggle = async () => {
    if (!user) {
      toaster.create({
        title: "Sign in required",
        description: "You must be signed in to add favorites.",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    if (!property) return;

    setIsToggling(true);
    try {
      if (isFavorited) {
        const result = await removeFromFavorites(property.id);
        if (result.success) {
          setIsFavorited(false);
          toaster.create({
            title: "Removed from favorites",
            description: "This property has been removed from your favorites.",
            type: "success",
            duration: 3000,
            closable: true,
          });
        } else {
          toaster.create({
            title: "Failed to remove favorite",
            description:
              result.error || "Something went wrong. Please try again.",
            type: "error",
            duration: 5000,
            closable: true,
          });
        }
      } else {
        const result = await addToFavorites(property.id);
        if (result.success) {
          setIsFavorited(true);
          toaster.create({
            title: "Added to favorites",
            description: "This property has been added to your favorites.",
            type: "success",
            duration: 3000,
            closable: true,
          });
        } else {
          toaster.create({
            title: "Failed to add favorite",
            description:
              result.error || "Something went wrong. Please try again.",
            type: "error",
            duration: 5000,
            closable: true,
          });
        }
      }
    } catch (error: any) {
      toaster.create({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsToggling(false);
    }
  };

  // Contact form state
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <Flex minH="100vh" direction="column">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <VStack textAlign="center">
            <Spinner size="xl" color="hsl(35, 80%, 56%)" />
            <Text mt={4} color="gray.600">
              Loading property...
            </Text>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" direction="column">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <VStack textAlign="center">
            <Heading
              as="h1"
              fontFamily="DM Serif Display, serif"
              fontSize="4xl"
              fontWeight="medium"
              mb={4}
              color="red.500"
            >
              Error loading property
            </Heading>
            <Text color="gray.600" mb={4}>
              {error.message}
            </Text>
            <Link href="/properties">
              <Button variant="outline">
                <FaArrowLeft
                  style={{ marginRight: 8, width: 16, height: 16 }}
                />
                Back to Properties
              </Button>
            </Link>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  if (!property) {
    return (
      <Flex minH="100vh" direction="column">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <VStack textAlign="center">
            <Heading
              as="h1"
              fontFamily="DM Serif Display, serif"
              fontSize="4xl"
              fontWeight="medium"
              mb={4}
            >
              Property not found
            </Heading>
            <Link href="/properties">
              <Button colorPalette="gray" rounded="xl">
                <FaArrowLeft
                  style={{ marginRight: 8, width: 16, height: 16 }}
                />
                Back to Properties
              </Button>
            </Link>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  const handleContact = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Basic validation
    if (!message.trim()) {
      toaster.create({
        title: "Please enter a message",
        description: "Message is required to contact the seller.",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    if (!property) return;

    // Check if user is authenticated
    if (!user) {
      toaster.create({
        title: "Sign in required",
        description: "You must be signed in to send messages.",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending message for property:", property.id);
      await sendContactMessage({
        propertyId: property.id,
        senderName: "", // Will be filled by API from user profile
        senderEmail: "", // Not needed anymore
        content: message,
        senderId: user.id, // Required for authenticated users
      });

      toaster.create({
        title: "Message sent!",
        description: "The seller will get back to you shortly.",
        type: "success",
        duration: 5000,
        closable: true,
      });

      // Reset form
      setMessage("");
    } catch (error: any) {
      console.error("Contact form error:", error);
      toaster.create({
        title: "Failed to send message",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert property images to lightbox slides format
  const slides = property ? property.images.map((img) => ({ src: img })) : [];

  // Check if current user is the property owner
  const isOwner = user && property && user.id === property.user_id;

  return (
    <Box minH="100vh">
      <Box as="main" pt={24} pb={16}>
        {/* Back link */}
        <Box maxW="container.xl" mx="auto" px={4} mb={6}>
          <Link href="/properties">
            <HStack
              gap={1.5}
              fontSize="sm"
              color="gray.600"
              _hover={{ color: "gray.900" }}
              transition="colors 0.2s"
            >
              <FaArrowLeft size={16} />
              <Text>Back to properties</Text>
            </HStack>
          </Link>
        </Box>

        {/* Image Gallery */}
        <Box maxW="container.xl" mx="auto" px={4} mb={10}>
          <Box position="relative" rounded="2xl" overflow="hidden">
            <AspectRatio ratio={{ base: 16 / 9, md: 2.2 / 1 }}>
              <Box
                position="relative"
                cursor="pointer"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
                _hover={{ opacity: 0.9 }}
                transition="opacity 0.2s"
                w="full"
                h="full"
              >
                <Image
                  src={property.images[0]}
                  alt={`${property.title} - main image`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </Box>
            </AspectRatio>

            {property.tag && (
              <Badge
                position="absolute"
                top={4}
                left={4}
                bg="hsl(35, 80%, 56%)"
                color="white"
                fontWeight="medium"
                px={3}
                py={1}
              >
                {property.tag}
              </Badge>
            )}
          </Box>

          {/* Thumbnails */}
          <HStack gap={3} mt={3} overflowX="auto" py={2}>
            {property.images.map((img, i) => (
              <Box
                key={i}
                as="button"
                position="relative"
                rounded="xl"
                overflow="hidden"
                w={{ base: 24, md: 32 }}
                h={{ base: 16, md: 20 }}
                flexShrink={0}
                border="2px"
                borderColor="transparent"
                opacity={0.9}
                _hover={{ opacity: 1, borderColor: "hsl(35, 80%, 56%)" }}
                transition="all 0.2s"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={img}
                  alt={`${property.title} - image ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Content Grid */}
        <Box maxW="container.xl" mx="auto" px={4}>
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10}>
            {/* Left: Details */}
            <GridItem>
              <VStack gap={8} alignItems="stretch">
                {/* Header */}
                <Box>
                  <Flex
                    justify="space-between"
                    alignItems="flex-start"
                    gap={4}
                    mb={2}
                  >
                    <Heading
                      as="h1"
                      fontFamily="DM Serif Display, serif"
                      fontSize={{ base: "3xl", md: "4xl" }}
                      fontWeight="medium"
                    >
                      {property.title}
                    </Heading>
                    <HStack gap={2}>
                      <IconButton
                        onClick={handleFavoriteToggle}
                        aria-label={
                          isFavorited
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        h={10}
                        w={10}
                        rounded="full"
                        variant="outline"
                        bg="white"
                        color={isFavorited ? "#E99E35" : "gray.600"}
                        disabled={isToggling}
                        _hover={{
                          bg: "gray.50",
                          transform: isToggling ? "none" : "scale(1.05)",
                        }}
                        transition="all 0.2s"
                        opacity={isToggling ? 0.7 : 1}
                      >
                        {isFavorited ? (
                          <FaHeart size={16} />
                        ) : (
                          <FaRegHeart size={16} />
                        )}
                      </IconButton>
                      <IconButton
                        aria-label="Share property"
                        h={10}
                        w={10}
                        rounded="full"
                        variant="outline"
                        _hover={{ bg: "gray.50" }}
                      >
                        <FaShare size={16} />
                      </IconButton>
                    </HStack>
                  </Flex>

                  <HStack gap={1.5} color="gray.600" fontSize="sm" mb={4}>
                    <FaMapMarkerAlt size={16} />
                    <Text>{property.location}</Text>
                  </HStack>

                  <Text
                    fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
                    fontSize="3xl"
                    color="hsl(35, 80%, 56%)"
                  >
                    {property.price}
                  </Text>
                </Box>

                {/* Stats */}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={3}
                  >
                    Features & Details
                  </Heading>
                  <HStack
                    gap={6}
                    py={5}
                    borderTop="1px"
                    borderBottom="1px"
                    borderColor="gray.200"
                  >
                    <HStack gap={2}>
                      <FaBed size={20} color="gray" />
                      <Text fontWeight="medium">{property.beds} Bedrooms</Text>
                    </HStack>
                    <HStack gap={2}>
                      <FaBath size={20} color="gray" />
                      <Text fontWeight="medium">
                        {property.baths} Bathrooms
                      </Text>
                    </HStack>
                    <HStack gap={2}>
                      <FaExpand size={20} color="gray" />
                      <Text fontWeight="medium">{property.size_m2} m²</Text>
                    </HStack>
                  </HStack>
                </Box>

                {/* Description */}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={3}
                  >
                    About this property
                  </Heading>
                  <Text color="gray.600" lineHeight="relaxed">
                    {property.description}
                  </Text>
                </Box>

                {/*Property type*/}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={4}
                  >
                    Type
                  </Heading>
                  <HStack gap={2}>
                    <Box
                      h={1.5}
                      w={1.5}
                      rounded="full"
                      bg="hsl(35, 80%, 56%)"
                      flexShrink={0}
                    />
                    <Text fontSize="sm" color="gray.600">
                      {property.type}
                    </Text>
                  </HStack>
                </Box>

                {/* Map Placeholder */}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={4}
                  >
                    Location
                  </Heading>
                  <AspectRatio ratio={16 / 9}>
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={3}
                      bg="gray.50"
                      rounded="2xl"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <FaMap size={40} color="gray" />
                      <Text fontSize="sm" color="gray.600">
                        Interactive map coming soon
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {property.location}
                      </Text>
                    </Flex>
                  </AspectRatio>
                </Box>

                {/* Created at */}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={4}
                  >
                    Created At
                  </Heading>
                  <HStack gap={2}>
                    <Box
                      h={1.5}
                      w={1.5}
                      rounded="full"
                      bg="hsl(35, 80%, 56%)"
                      flexShrink={0}
                    />
                    <Text fontSize="sm" color="gray.600">
                      {property.created_at
                        ? new Date(property.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "Date not available"}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </GridItem>

            {/* Right: Seller & Contact */}
            <GridItem>
              <VStack gap={6} alignItems="stretch">
                {/* Seller Card */}
                <Box
                  bg="white"
                  rounded="2xl"
                  p={6}
                  shadow="lg"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Heading
                    as="h3"
                    fontFamily="DM Serif Display, serif"
                    fontSize="xl"
                    fontWeight="medium"
                    mb={4}
                  >
                    {isOwner ? "Your Property" : "Listed by Owner"}
                  </Heading>

                  <HStack gap={3} mb={4}>
                    <Flex
                      h={12}
                      w={12}
                      rounded="full"
                      bg="gray.100"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FaUser size={24} color="gray" />
                    </Flex>
                    <Box>
                      <Text fontWeight="semibold">{property.seller_name}</Text>
                      <HStack gap={1} fontSize="xs" color="gray.600">
                        <FaCalendarAlt size={12} />
                        <Text>{formatMemberSince(property.seller_since)}</Text>
                      </HStack>
                    </Box>
                  </HStack>

                  <HStack gap={2} fontSize="sm" color="gray.600" mb={6}>
                    <FaPhone size={16} />
                    <Text>{property.seller_phone}</Text>
                  </HStack>

                  {/* Conditional Content - Contact Form, Sign In Prompt, or Owner Actions */}
                  {isOwner ? (
                    <VStack gap={4} align="stretch">
                      <Box
                        bg="green.50"
                        border="1px"
                        borderColor="green.200"
                        rounded="xl"
                        p={4}
                        textAlign="center"
                      >
                        <Text
                          fontSize="sm"
                          color="green.700"
                          fontWeight="medium"
                        >
                          This is your property listing
                        </Text>
                        <Text fontSize="xs" color="green.600" mt={1}>
                          You can edit or manage your listing
                        </Text>
                      </Box>

                      <VStack gap={2} align="stretch">
                        <Button
                          asChild
                          w="full"
                          colorPalette="orange"
                          rounded="xl"
                          bg="hsl(35, 80%, 56%)"
                          color="white"
                          _hover={{
                            bg: "hsl(35, 80%, 50%)",
                          }}
                        >
                          <Link href={`/list-property?edit=${property.id}`}>
                            Edit Property
                          </Link>
                        </Button>

                        <Button
                          asChild
                          w="full"
                          colorPalette="gray"
                          rounded="xl"
                        >
                          <Link href="/profile">View All Listings</Link>
                        </Button>
                      </VStack>
                    </VStack>
                  ) : !user ? (
                    /* Sign in required message for unauthenticated users */
                    <VStack gap={4} align="stretch">
                      <Box
                        bg="gray.50"
                        rounded="xl"
                        p={6}
                        textAlign="center"
                        borderBottomColor="gray.200"
                      >
                        <Text
                          fontSize="sm"
                          color="gray.700"
                          fontWeight="medium"
                          mb={2}
                        >
                          Sign in to contact the seller
                        </Text>
                        <Text fontSize="xs" mb={4} color="gray.500">
                          You need to be signed in to send messages to property
                          owners.
                        </Text>
                        <VStack gap={2}>
                          <Button
                            asChild
                            w="full"
                            bg="hsl(35, 80%, 56%)"
                            color="white"
                            _hover={{
                              bg: "hsl(35, 80%, 50%)",
                            }}
                            rounded="xl"
                          >
                            <Link href="/sign-in">Sign In</Link>
                          </Button>
                          <Button
                            asChild
                            w="full"
                            colorPalette="gray"
                            rounded="xl"
                          >
                            <Link href="/sign-up">Create Account</Link>
                          </Button>
                        </VStack>
                      </Box>
                    </VStack>
                  ) : (
                    <Box as="form" onSubmit={handleContact}>
                      <VStack gap={4}>
                        <Field.Root required>
                          <Field.Label fontSize="xs">
                            Message
                            <Field.RequiredIndicator />
                          </Field.Label>
                          <Textarea
                            placeholder="Hi, I'm interested in this property. Could you tell me more about..."
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            minH="120px"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </Field.Root>

                        <Button
                          type="submit"
                          w="full"
                          colorPalette="gray"
                          rounded="xl"
                          disabled={isSubmitting}
                          loading={isSubmitting}
                        >
                          <FaPaperPlane />{" "}
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </VStack>
                    </Box>
                  )}
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />

      <Toaster />
    </Box>
  );
};

export default PropertyDetail;
