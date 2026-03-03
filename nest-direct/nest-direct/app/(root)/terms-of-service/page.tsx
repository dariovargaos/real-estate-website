import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using NestDirect, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. These terms apply to all users, including browsers, buyers, sellers, and contributors of content.",
  },
  {
    title: "2. Account Registration",
    content:
      "To access certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be at least 18 years old to use NestDirect.",
  },
  {
    title: "3. Property Listings",
    content:
      "Sellers are solely responsible for the accuracy of their property listings, including descriptions, photos, pricing, and legal compliance. NestDirect does not verify listing information and is not liable for inaccuracies. We reserve the right to remove listings that violate our guidelines.",
  },
  {
    title: "4. User Conduct",
    content:
      "You agree not to use NestDirect for unlawful purposes, post fraudulent or misleading listings, harass other users, attempt to circumvent platform security, or scrape content without permission. Violations may result in account suspension or termination.",
  },
  {
    title: "5. Transactions",
    content:
      "NestDirect facilitates connections between buyers and sellers but is not a party to any real estate transaction. All negotiations, agreements, and legal obligations are between the buyer and seller. We strongly recommend engaging qualified legal and financial professionals.",
  },
  {
    title: "6. Fees & Payments",
    content:
      "Certain services on NestDirect may require payment. All fees are disclosed before purchase and are non-refundable unless otherwise stated. We reserve the right to modify pricing with reasonable notice.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All NestDirect content, branding, and technology are protected by intellectual property laws. Users retain ownership of content they post but grant NestDirect a non-exclusive licence to display and distribute it on the platform.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "NestDirect is provided 'as is' without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to property transaction disputes.",
  },
  {
    title: "9. Termination",
    content:
      "We may suspend or terminate your account at any time for violations of these terms. You may also delete your account at any time through your profile settings. Upon termination, your right to use the platform ceases immediately.",
  },
  {
    title: "10. Governing Law",
    content:
      "These Terms are governed by the laws of the State of California, United States. Any disputes shall be resolved in the courts of San Francisco County, California.",
  },
];

export default function TermsOfService() {
  return (
    <Box minH="100vh" bg="#FCFAF8">
      <Box as="main" pt="24" pb="16">
        <Container maxW="3xl" px="4">
          <Heading
            as="h1"
            size={{ base: "4xl", md: "5xl" }}
            fontFamily="DM Serif Display, serif"
            fontWeight="medium"
            mb="2"
          >
            Terms of Service
          </Heading>
          <Text color="gray.500" mb="10" textStyle="sm">
            Last updated: March 1, 2026
          </Text>
          <Stack gap="8">
            {sections.map((s, i) => (
              <Box as="section" key={i}>
                <Heading
                  as="h2"
                  size="xl"
                  fontFamily="DM Serif Display, serif"
                  fontWeight="medium"
                  mb="2"
                >
                  {s.title}
                </Heading>
                <Text color="gray.500" lineHeight="relaxed" textStyle="sm">
                  {s.content}
                </Text>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
