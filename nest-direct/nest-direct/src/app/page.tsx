import {
  Box,
  Flex,
  Container,
  Text,
  Heading,
  Input,
  Button,
  Icon,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";

export default function Home() {
  return (
    <Box
      position="relative"
      minH="85vh"
      display="flex"
      alignItems="center"
      overflow="hidden"
    >
      {/* Background Image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={"url(/hero-image.jpg)"}
        bgSize="cover"
        w="100%"
        h="100%"
        zIndex={0}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        background="linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)"
        w="100%"
        h="100%"
        zIndex={1}
        pointerEvents="none"
      />

      {/* Content */}
      <Container
        position="relative"
        zIndex={2}
        maxW="container.xl"
        px={4}
        pt={20}
      >
        <Box maxW="2xl">
          <Text
            color="#e48f18"
            fontWeight="semibold"
            fontSize="sm"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={4}
          >
            Peer-to-Peer Real Estate
          </Text>
          <Heading
            as="h1"
            fontFamily="serif"
            fontSize={{ base: "5xl", md: "7xl" }}
            color="gray.900"
            lineHeight="tight"
            mb={6}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Box as="span">Find Your</Box>
            <Box as="span">Perfect Home,</Box>
            <Box as="span" color="teal.400">
              Directly.
            </Box>
          </Heading>
          <Text
            color="gray.700"
            fontSize={{ base: "lg", md: "xl" }}
            mb={10}
            maxW="lg"
          >
            Connect with property owners — no agents, no hidden fees. Buy and
            sell real estate the way it should be.
          </Text>

          {/* Search Bar */}
          <Box
            bg="whiteAlpha.900"
            opacity={0.95}
            borderRadius="2xl"
            p={2}
            boxShadow="lg"
            maxW="xl"
          >
            <Flex align="center" gap={2}>
              <Flex align="center" gap={2} flex={1} px={4}>
                <Icon boxSize={5} color="gray.400" flexShrink={0}>
                  <LuMapPin />
                </Icon>
                <Input
                  type="text"
                  placeholder="Search by city, neighborhood, or address..."
                  py={3}
                  fontSize="sm"
                />
              </Flex>
              <Button
                size="lg"
                borderRadius="xl"
                flexShrink={0}
                colorScheme="teal"
              >
                <CiSearch />
                Search
              </Button>
            </Flex>
          </Box>

          {/* Stats */}
          <Flex gap={8} mt={10}>
            {[
              { value: "12K+", label: "Active Listings" },
              { value: "$0", label: "Agent Fees" },
              { value: "8K+", label: "Happy Buyers" },
            ].map((stat) => (
              <Box key={stat.label}>
                <Text fontSize="2xl" fontWeight="bold" color="teal.400">
                  {stat.value}
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
