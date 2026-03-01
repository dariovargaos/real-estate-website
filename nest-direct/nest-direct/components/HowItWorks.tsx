import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

//icons
import { FaSearch, FaRegCommentDots, FaHandshake } from "react-icons/fa";

const steps = [
  {
    icon: FaSearch,
    title: "Discover Properties",
    description:
      "Browse thousands of listings posted directly by property owners. Filter by location, price, and features to find your match.",
  },
  {
    icon: FaRegCommentDots,
    title: "Connect Directly",
    description:
      "Message sellers directly through our secure platform. Schedule viewings, ask questions, and negotiate — no middlemen.",
  },
  {
    icon: FaHandshake,
    title: "Close the Deal",
    description:
      "Finalize your purchase with transparent pricing. Save thousands by cutting out traditional agent commissions.",
  },
];

export default function HowItWorks() {
  //Color palette
  const bg = "orange.50";
  const secondary = "orange.500";
  const secondaryFg = "white";
  const muted = "gray.500";
  const mutedFg = "gray.600";
  const foreground = "gray.900";

  return (
    <Box as="section" id="how-it-works" py={{ base: 16, md: 24 }} bg={bg}>
      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        <Box textAlign="center" mb={16}>
          <Text
            color="#F0C159"
            fontWeight="semibold"
            fontSize="sm"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={3}
          >
            Simple Process
          </Text>
          <Heading
            as="h2"
            fontFamily="serif"
            fontSize={{ base: "4xl", md: "5xl" }}
            color={foreground}
            mb={4}
          >
            How It Works
          </Heading>
          <Text color={mutedFg} maxW="md" mx="auto">
            Three simple steps to your next home — or to selling yours.
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          maxW="4xl"
          mx="auto"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <VStack key={index} textAlign="center" role="group" gap={3}>
                <Flex
                  align="center"
                  justify="center"
                  w={16}
                  h={16}
                  rounded="2xl"
                  bg="#F4E9DB" // 20 = ~12% opacity
                  color={secondary}
                  mb={6}
                  transition="all 0.3s"
                  _groupHover={{ bg: secondary, color: secondaryFg }}
                >
                  <Icon size={28} color="#E99E35" />
                </Flex>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={muted}
                  opacity={0.5}
                  mb={2}
                >
                  STEP {index + 1}
                </Text>
                <Heading
                  as="h3"
                  fontFamily="serif"
                  fontSize="xl"
                  color={foreground}
                  mb={3}
                >
                  {step.title}
                </Heading>
                <Text color={muted} fontSize="sm" lineHeight="relaxed">
                  {step.description}
                </Text>
              </VStack>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
