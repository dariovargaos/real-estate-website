"use client";

import { useState, useMemo } from "react";
import PropertyCard from "../../../components/PropertyCard";
import { useListedProperties } from "../../../hooks/useListedProperties";

import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  VStack,
  Select,
  Input,
  InputGroup,
  createListCollection,
  Spinner,
} from "@chakra-ui/react";

//icons
import { CiSearch } from "react-icons/ci";

export default function Properties() {
  const { properties, loading, error } = useListedProperties();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string[]>(["default"]);
  const [bedsFilter, setBedsFilter] = useState<string[]>(["any"]);

  // Collection data for Select components
  const bedsCollection = createListCollection({
    items: [
      { label: "Any Beds", value: "any" },
      { label: "2+ Beds", value: "2" },
      { label: "3+ Beds", value: "3" },
      { label: "4+ Beds", value: "4" },
    ],
  });

  const sortCollection = createListCollection({
    items: [
      { label: "Default", value: "default" },
      { label: "Price: Low → High", value: "price-asc" },
      { label: "Price: High → Low", value: "price-desc" },
    ],
  });

  const filtered = useMemo(() => {
    if (!properties) return [];

    let result = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()),
    );

    if (bedsFilter[0] !== "any") {
      const min = parseInt(bedsFilter[0]);
      result = result.filter((p) => p.beds >= min);
    }

    if (sortBy[0] === "price-asc") {
      result = [...result].sort(
        (a, b) =>
          parseFloat(a.price.replace(/[^0-9]/g, "")) -
          parseFloat(b.price.replace(/[^0-9]/g, "")),
      );
    } else if (sortBy[0] === "price-desc") {
      result = [...result].sort(
        (a, b) =>
          parseFloat(b.price.replace(/[^0-9]/g, "")) -
          parseFloat(a.price.replace(/[^0-9]/g, "")),
      );
    }

    return result;
  }, [properties, search, sortBy, bedsFilter]);

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="main" pt={{ base: 16, md: 16 }}>
        {/* Header */}
        <Box as="section" py={16} bg="#F6F2EE">
          <Container
            display="flex"
            flexDirection="column"
            maxW="2xl"
            px={4}
            gap={5}
            textAlign="center"
          >
            <Text
              color="#E99E35"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="widest"
              textTransform="uppercase"
              mb={2}
            >
              Marketplace
            </Text>
            <Heading
              as="h1"
              fontFamily="DM Serif Display"
              fontWeight="extralight"
              fontSize={{ base: "4xl", md: "5xl" }}
              mb={4}
            >
              Browse Properties
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Find your dream home directly from property owners. No agents, no
              extra fees.
            </Text>
          </Container>
        </Box>

        {/* Show loading state */}
        {loading && (
          <Box py={16} textAlign="center">
            <VStack gap={4}>
              <Spinner size="lg" color="#E99E35" />
              <Text>Loading properties...</Text>
            </VStack>
          </Box>
        )}

        {/* Show error state */}
        {error && (
          <Box py={16} textAlign="center">
            <VStack gap={4}>
              <Text color="red.500" fontSize="lg">
                Error loading properties
              </Text>
              <Text color="gray.500">{error}</Text>
            </VStack>
          </Box>
        )}

        {/* Show filters and results only when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Filters */}
            <Box
              as="section"
              py={6}
              bg="gray.50"
              borderBottomWidth={1}
              borderColor="gray.200"
            >
              <Container maxW="container.xl" px={4}>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  gap={4}
                  align="center"
                >
                  <Box flex={1} w="full" position="relative">
                    <InputGroup startElement={<CiSearch />}>
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        pl={10}
                        placeholder="Search by title or location..."
                        rounded="xl"
                      />
                    </InputGroup>
                  </Box>
                  <Box w={{ base: "full", md: 40 }}>
                    <Select.Root
                      collection={bedsCollection}
                      value={bedsFilter}
                      onValueChange={(e) => setBedsFilter(e.value)}
                    >
                      <Select.HiddenSelect />

                      <Select.Control>
                        <Select.Trigger borderRadius="xl">
                          <Select.ValueText placeholder="Any Beds" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {bedsCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Box>
                  <Box w={{ base: "full", md: 44 }}>
                    <Select.Root
                      collection={sortCollection}
                      value={sortBy}
                      onValueChange={(e) => setSortBy(e.value)}
                    >
                      <Select.HiddenSelect />

                      <Select.Control>
                        <Select.Trigger borderRadius="xl">
                          <Select.ValueText placeholder="Default" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {sortCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Box>
                </Flex>
              </Container>
            </Box>

            {/* Results */}
            <Box as="section" py={12} bg="gray.50">
              <Container maxW="container.xl" px={4}>
                <Text fontSize="sm" color="gray.500" mb={6}>
                  {filtered.length} properties found
                </Text>
                {filtered.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {filtered.map((property, index) => (
                      <Box
                        key={property.id}
                        opacity={0}
                        animation="fadeInUp 0.4s forwards"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <PropertyCard {...property} />
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <VStack textAlign="center" py={16}>
                    <Text color="gray.600" fontSize="lg">
                      No properties match your search.
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Try adjusting your filters.
                    </Text>
                  </VStack>
                )}
              </Container>
            </Box>
          </>
        )}
      </Box>
      {/* Chakra UI animation keyframes for fadeInUp */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
