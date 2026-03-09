"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

//chakra components
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  Heading,
  Image,
  IconButton,
  Input,
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
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaPaperPlane,
  FaMap,
} from "react-icons/fa";

import { useProperty } from "../../../../hooks/useProperty";
import { useUser } from "../../../../hooks/useAuthContext";
import { Toaster, toaster } from "../../../../components/ui/toaster";

const PropertyDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: property, isLoading: loading, error } = useProperty(id);
  const { user } = useUser();
  const [activeImage, setActiveImage] = useState(0);

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

  const handleContact = (e: React.SyntheticEvent) => {
    e.preventDefault();
    toaster.create({
      title: "Message sent!",
      description: "The seller will get back to you shortly.",
      type: "success",
    });
  };

  const nextImage = () =>
    setActiveImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    setActiveImage(
      (prev) => (prev - 1 + property.images.length) % property.images.length,
    );

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
              <Image
                src={property.images[activeImage]}
                alt={`${property.title} - image ${activeImage + 1}`}
                objectFit="cover"
                transition="opacity 0.3s"
              />
            </AspectRatio>

            <IconButton
              aria-label="Previous image"
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              h={10}
              w={10}
              rounded="full"
              bg="whiteAlpha.800"
              backdropFilter="blur(4px)"
              _hover={{ bg: "white" }}
              onClick={prevImage}
            >
              <FaChevronLeft size={20} />
            </IconButton>

            <IconButton
              aria-label="Next image"
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              h={10}
              w={10}
              rounded="full"
              bg="whiteAlpha.800"
              backdropFilter="blur(4px)"
              _hover={{ bg: "white" }}
              onClick={nextImage}
            >
              <FaChevronRight size={20} />
            </IconButton>

            {/* Dots */}
            <HStack
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              gap={2}
            >
              {property.images.map((_, i) => (
                <Box
                  key={i}
                  as="button"
                  h={2}
                  w={i === activeImage ? 6 : 2}
                  rounded="full"
                  bg={
                    i === activeImage ? "hsl(35, 80%, 56%)" : "whiteAlpha.600"
                  }
                  transition="all 0.2s"
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </HStack>

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
          <HStack gap={3} mt={3}>
            {property.images.map((img, i) => (
              <Box
                key={i}
                as="button"
                position="relative"
                rounded="xl"
                overflow="hidden"
                w={{ base: 24, md: 32 }}
                h={{ base: 16, md: 20 }}
                border="2px"
                borderColor={
                  i === activeImage ? "hsl(35, 80%, 56%)" : "transparent"
                }
                opacity={i === activeImage ? 1 : 0.6}
                _hover={{ opacity: 1 }}
                transition="all 0.2s"
                onClick={() => setActiveImage(i)}
              >
                <Image src={img} alt="" w="full" h="full" objectFit="cover" />
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
                        aria-label="Add to favorites"
                        h={10}
                        w={10}
                        rounded="full"
                        variant="outline"
                        _hover={{ bg: "gray.50" }}
                      >
                        <FaRegHeart size={16} />
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
                <HStack
                  gap={6}
                  py={5}
                  borderTop="1px"
                  borderBottom="1px"
                  borderColor="gray.200"
                >
                  <HStack gap={2}>
                    <FaBed size={20} color="gray" />
                    <Text fontWeight="medium">{property.beds} Beds</Text>
                  </HStack>
                  <HStack gap={2}>
                    <FaBath size={20} color="gray" />
                    <Text fontWeight="medium">{property.baths} Baths</Text>
                  </HStack>
                  <HStack gap={2}>
                    <FaExpand size={20} color="gray" />
                    <Text fontWeight="medium">{property.size_m2}</Text>
                  </HStack>
                </HStack>

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

                {/* Features */}
                <Box>
                  <Heading
                    as="h2"
                    fontFamily="DM Serif Display, serif"
                    fontSize="2xl"
                    fontWeight="medium"
                    mb={4}
                  >
                    Features & Amenities
                  </Heading>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                    {property.features.map((feature) => (
                      <HStack key={feature} gap={2}>
                        <Box
                          h={1.5}
                          w={1.5}
                          rounded="full"
                          bg="hsl(35, 80%, 56%)"
                          flexShrink={0}
                        />
                        <Text fontSize="sm" color="gray.600">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
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
                        <Text>Member since {property.seller_since}</Text>
                      </HStack>
                    </Box>
                  </HStack>

                  <HStack gap={2} fontSize="sm" color="gray.600" mb={6}>
                    <FaPhone size={16} />
                    <Text>{property.seller_phone}</Text>
                  </HStack>

                  {/* Conditional Content - Contact Form or Owner Actions */}
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
                  ) : (
                    <Box as="form" onSubmit={handleContact}>
                      <VStack gap={4}>
                        <Field.Root required>
                          <Field.Label fontSize="xs">
                            Your Name
                            <Field.RequiredIndicator />
                          </Field.Label>
                          <Input
                            placeholder="John Doe"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                          />
                        </Field.Root>

                        <Field.Root required>
                          <Field.Label fontSize="xs">
                            Email
                            <Field.RequiredIndicator />
                          </Field.Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                          />
                        </Field.Root>

                        <Field.Root required>
                          <Field.Label fontSize="xs">
                            Message
                            <Field.RequiredIndicator />
                          </Field.Label>
                          <Textarea
                            placeholder="I'm interested in this property…"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            minH="100px"
                          />
                        </Field.Root>

                        <Button
                          type="submit"
                          w="full"
                          colorPalette="gray"
                          rounded="xl"
                        >
                          {<FaPaperPlane />} Send Message
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
      <Toaster />
    </Box>
  );
};

export default PropertyDetail;
