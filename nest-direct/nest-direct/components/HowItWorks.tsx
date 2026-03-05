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
import { FaRegCommentDots } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { LuHandshake } from "react-icons/lu";

const steps = [
  {
    icon: CiSearch,
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
    icon: LuHandshake,
    title: "Close the Deal",
    description:
      "Finalize your purchase with transparent pricing. Save thousands by cutting out traditional agent commissions.",
  },
];

export default function HowItWorks() {
  return (
    <Box as="section" id="how-it-works" py={{ base: 16, md: 24 }} bg="#F6F2EE">
      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        <Box textAlign="center" mb={16}>
          <Text
            color="#E99E35"
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
            fontFamily="DM Serif Display, serif"
            fontWeight="thin"
            fontSize={{ base: "4xl", md: "5xl" }}
            mb={4}
          >
            How It Works
          </Heading>
          <Text color="gray.500" maxW="md" mx="auto">
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
                  bg="#F4E9DB"
                  mb={6}
                >
                  <Icon size={28} color="#E99E35" strokeWidth={2} />
                </Flex>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  opacity={0.5}
                  mb={2}
                >
                  STEP {index + 1}
                </Text>
                <Heading
                  as="h3"
                  fontFamily="serif"
                  fontSize="xl"
                  fontWeight="thin"
                  mb={3}
                >
                  {step.title}
                </Heading>
                <Text color="gray.500" fontSize="sm" lineHeight="relaxed">
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
