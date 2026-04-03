"use client";

import {
  Box,
  Container,
  Text,
  Heading,
  Button,
  Flex,
  Grid,
  Badge,
  Card,
  List,
  Icon,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";

// React Icons
import { FaCheck } from "react-icons/fa";
import { LuSparkles, LuCrown } from "react-icons/lu";
import { TbBolt } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";
import { CiCamera, CiStar, CiImageOn } from "react-icons/ci";

const featuredPlans = [
  {
    name: "Spotlight",
    price: "€29",
    period: "per listing / 2 weeks",
    description: "Get your property noticed with priority placement.",
    icon: TbBolt,
    popular: false,
    features: [
      "Featured badge on listing",
      "Priority in search results",
      "2 weeks of promotion",
      "Basic analytics dashboard",
    ],
  },
  {
    name: "Premium",
    price: "€59",
    period: "per listing / month",
    description: "Maximum visibility with homepage featured section.",
    icon: LuCrown,
    popular: true,
    features: [
      "Homepage featured section",
      "Top of search results",
      "30 days of promotion",
      "Detailed analytics & insights",
      "Social media promotion",
      "Highlighted listing border",
    ],
  },
  {
    name: "Elite",
    price: "€99",
    period: "per listing / month",
    description: "The ultimate package for serious sellers.",
    icon: LuSparkles,
    popular: false,
    features: [
      "Everything in Premium",
      "Dedicated account manager",
      "60 days of promotion",
      "Email blast to matched buyers",
      "Virtual tour integration",
      "Priority customer support",
    ],
  },
];

const photographyPackages = [
  {
    name: "Essential",
    price: "€149",
    description: "Perfect for apartments and smaller properties.",
    icon: CiCamera,
    features: [
      "Up to 15 professional photos",
      "Basic photo editing & color correction",
      "1-hour photo session",
      "Delivered within 48 hours",
      "Digital download in high resolution",
    ],
  },
  {
    name: "Professional",
    price: "€299",
    description: "Ideal for houses and larger properties.",
    icon: CiImageOn,
    popular: true,
    features: [
      "Up to 30 professional photos",
      "Advanced editing & HDR processing",
      "2-hour photo session",
      "Drone aerial photography",
      "Virtual staging for empty rooms",
      "Delivered within 24 hours",
    ],
  },
  {
    name: "Luxury",
    price: "€499",
    description: "For premium properties that deserve the best.",
    icon: CiStar,
    features: [
      "Unlimited professional photos",
      "Cinematic video walkthrough",
      "3-hour session with styling",
      "Drone + twilight photography",
      "360° virtual tour",
      "Same-day express delivery",
      "Social media ready formats",
    ],
  },
];

export default function Premium() {
  const handleSelect = (planName: string) => {
    toaster.create({
      title: "Plan Selected",
      description: `You selected the ${planName} plan. This feature will be available soon!`,
      type: "success",
      duration: 3000,
    });
  };

  return (
    <Box minH="100vh" bg="#FCFAF8">
      {/* Hero */}
      <Box pt={28} pb={16} px={4} textAlign="center">
        <Container maxW="3xl" mx="auto">
          <Badge
            bg="#E99E35"
            color="white"
            borderRadius="full"
            px={4}
            py={2}
            mb={4}
            display="inline-flex"
            alignItems="center"
            gap={2}
          >
            <LuSparkles />
            Boost Your Listings
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl" }}
            fontFamily="DM Serif Display, serif"
            fontWeight="thin"
            mb={4}
            lineHeight="tight"
          >
            Sell Faster with Premium
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="2xl" mx="auto">
            Stand out from the crowd with featured placements and professional
            photography. Properties with premium features sell up to 3x faster.
          </Text>
        </Container>
      </Box>

      {/* Stats */}
      <Box pb={12} px={4}>
        <Container maxW="4xl" mx="auto">
          <Grid templateColumns="repeat(3, 1fr)" gap={6} textAlign="center">
            {[
              { value: "3x", label: "Faster sales", icon: TbBolt },
              { value: "85%", label: "More views", icon: FiUsers },
              { value: "24h", label: "Photo delivery", icon: FaRegClock },
            ].map((stat) => (
              <Flex key={stat.label} direction="column" align="center" p={4}>
                <Flex color="#E99E35" mb={2} justify="center">
                  <stat.icon size={20} />
                </Flex>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
                >
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {stat.label}
                </Text>
              </Flex>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Listing Plans */}
      <Box py={16} px={4} bg="#F6F4F1">
        <Container maxW="6xl" mx="auto">
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Heading
              as="h2"
              fontSize="3xl"
              fontFamily="DM Serif Display, serif"
              fontWeight="thin"
              mb={3}
            >
              Featured Listing Plans
            </Heading>
            <Text color="gray.500" maxW="xl">
              Get your property in front of more buyers with premium placement
              in the featured section and search results.
            </Text>
          </Flex>

          {/* Mobile: horizontal scroll with peek. Desktop: 3-col grid */}
          <Box
            display={{ base: "flex", md: "grid" }}
            gridTemplateColumns={{ md: "repeat(3, 1fr)" }}
            gap={6}
            overflowX={{ base: "auto", md: "unset" }}
            pb={{ base: 4, md: 0 }}
            pt={{ base: 6, md: 0 }}
            mx={{ base: -4, md: 0 }}
            px={{ base: 4, md: 0 }}
            css={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {featuredPlans.map((plan) => (
              <Card.Root
                key={plan.name}
                position="relative"
                border={
                  plan.popular ? "2px solid #E99E35" : "1px solid #D5D1CB"
                }
                borderRadius="xl"
                bg="white"
                boxShadow={plan.popular ? "xl" : "md"}
                display="flex"
                flexDirection="column"
                flexShrink={0}
                w={{ base: plan.popular ? "85%" : "78%", md: "auto" }}
                css={{ scrollSnapAlign: "start" }}
              >
                {plan.popular && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    bg="#E99E35"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    zIndex={10}
                    boxShadow="sm"
                  >
                    Most Popular
                  </Badge>
                )}

                <Card.Header textAlign="center" pb={2}>
                  <Flex justify="center" mb={3}>
                    <Flex
                      h={12}
                      w={12}
                      borderRadius="full"
                      bg="#F5F5F5"
                      align="center"
                      justify="center"
                    >
                      <Box color="#E99E35">
                        <plan.icon size={24} />
                      </Box>
                    </Flex>
                  </Flex>
                  <Card.Title
                    fontSize="xl"
                    fontFamily="DM Serif Display, serif"
                  >
                    {plan.name}
                  </Card.Title>
                  <Card.Description color="gray.500">
                    {plan.description}
                  </Card.Description>
                </Card.Header>

                <Card.Body flex={1}>
                  <Flex
                    direction="column"
                    align="center"
                    textAlign="center"
                    mb={6}
                  >
                    <Text
                      fontSize="4xl"
                      fontFamily="UI Serif, Georgia, Cambria, 'Times New Roman', Times, serif"
                    >
                      {plan.price}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {plan.period}
                    </Text>
                  </Flex>
                  <List.Root spaceY={3}>
                    {plan.features.map((feature) => (
                      <List.Item
                        key={feature}
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        fontSize="sm"
                      >
                        <Box color="#E99E35" mt={0.5} flexShrink={0}>
                          <FaCheck size={14} />
                        </Box>
                        <Text color="gray.500">{feature}</Text>
                      </List.Item>
                    ))}
                  </List.Root>
                </Card.Body>

                <Card.Footer>
                  <Button
                    w="full"
                    colorPalette="gray"
                    variant={plan.popular ? "solid" : "surface"}
                    color={plan.popular ? "white" : "black"}
                    borderRadius="xl"
                    size="md"
                    rounded="xl"
                    _hover={{
                      bg: plan.popular ? "" : "#E99E35",
                      color: plan.popular ? "" : "white",
                    }}
                    onClick={() => handleSelect(plan.name)}
                  >
                    Choose {plan.name}
                  </Button>
                </Card.Footer>
              </Card.Root>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Photography Packages */}
      <Box py={16} px={4}>
        <Container maxW="6xl" mx="auto">
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Badge
              bg="transparent"
              color="black"
              border="2px solid gray"
              borderRadius="full"
              px={4}
              py={2}
              mb={4}
              display="inline-flex"
              alignItems="center"
              gap={2}
            >
              <Icon strokeWidth={2} size="sm">
                <CiCamera />
              </Icon>
              Professional Photography
            </Badge>
            <Heading
              as="h2"
              fontSize="3xl"
              fontFamily="DM Serif Display, serif"
              fontWeight="thin"
              mb={3}
            >
              Pro Photography Packages
            </Heading>
            <Text color="gray.500" maxW="xl">
              Our certified photographers will visit your property and capture
              stunning images that make buyers fall in love at first sight.
            </Text>
          </Flex>

          {/* Mobile: horizontal scroll with peek. Desktop: 3-col grid */}
          <Box
            display={{ base: "flex", md: "grid" }}
            gridTemplateColumns={{ md: "repeat(3, 1fr)" }}
            gap={6}
            overflowX={{ base: "auto", md: "unset" }}
            pb={{ base: 4, md: 0 }}
            pt={{ base: 6, md: 0 }}
            mx={{ base: -4, md: 0 }}
            px={{ base: 4, md: 0 }}
            css={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {photographyPackages.map((pkg) => (
              <Card.Root
                key={pkg.name}
                position="relative"
                border={pkg.popular ? "2px solid #E99E35" : "1px solid #D5D1CB"}
                borderRadius="xl"
                bg="white"
                boxShadow={pkg.popular ? "xl" : "md"}
                display="flex"
                flexDirection="column"
                flexShrink={0}
                w={{ base: pkg.popular ? "85%" : "78%", md: "auto" }}
                css={{ scrollSnapAlign: "start" }}
              >
                {pkg.popular && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    bg="#E99E35"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    zIndex={10}
                    boxShadow="sm"
                  >
                    Best Value
                  </Badge>
                )}

                <Card.Header textAlign="center" pb={2}>
                  <Flex justify="center" mb={3}>
                    <Flex
                      h={12}
                      w={12}
                      borderRadius="full"
                      bg="#F5F5F5"
                      align="center"
                      justify="center"
                    >
                      <Box color="#E99E35">
                        <Icon strokeWidth={1} size="lg">
                          <pkg.icon />
                        </Icon>
                      </Box>
                    </Flex>
                  </Flex>
                  <Card.Title
                    fontSize="xl"
                    fontFamily="DM Serif Display, serif"
                  >
                    {pkg.name}
                  </Card.Title>
                  <Card.Description color="gray.500">
                    {pkg.description}
                  </Card.Description>
                </Card.Header>

                <Card.Body flex={1}>
                  <Flex
                    direction="column"
                    align="center"
                    textAlign="center"
                    mb={6}
                  >
                    <Text
                      fontSize="4xl"
                      fontFamily="UI Serif, Georgia, Cambria, 'Times New Roman', Times, serif"
                    >
                      {pkg.price}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      one-time payment
                    </Text>
                  </Flex>
                  <List.Root spaceY={3}>
                    {pkg.features.map((feature) => (
                      <List.Item
                        key={feature}
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        fontSize="sm"
                      >
                        <Box color="#E99E35" mt={0.5} flexShrink={0}>
                          <FaCheck size={14} />
                        </Box>
                        <Text color="gray.500">{feature}</Text>
                      </List.Item>
                    ))}
                  </List.Root>
                </Card.Body>

                <Card.Footer>
                  <Button
                    w="full"
                    colorPalette="gray"
                    variant={pkg.popular ? "solid" : "surface"}
                    color={pkg.popular ? "white" : "black"}
                    size="md"
                    rounded="xl"
                    _hover={{
                      bg: pkg.popular ? "" : "#E99E35",
                      color: pkg.popular ? "white" : "white",
                    }}
                    onClick={() => handleSelect(`${pkg.name} Photography`)}
                  >
                    Book {pkg.name}
                  </Button>
                </Card.Footer>
              </Card.Root>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ / CTA */}
      <Box py={16} px={4} bg="#F6F4F1">
        <Container maxW="2xl" mx="auto">
          <Flex direction="column" align="center" textAlign="center">
            <Heading
              as="h2"
              fontSize="3xl"
              fontFamily="DM Serif Display, serif"
              fontWeight="thin"
              mb={4}
            >
              Not Sure Which Plan?
            </Heading>
            <Text color="gray.500" mb={8}>
              Our team is here to help you choose the right package for your
              property. Get in touch and we&apos;ll recommend the best option
              for your needs.
            </Text>
            <Button
              colorPalette="gray"
              rounded="xl"
              size="lg"
              onClick={() => handleSelect("Consultation")}
            >
              Get a Free Consultation
            </Button>
          </Flex>
        </Container>
      </Box>
      <Toaster />
    </Box>
  );
}
