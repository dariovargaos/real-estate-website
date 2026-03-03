import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, such as your name, email address, phone number, and property listing details when you create an account or list a property. We also automatically collect usage data including IP address, browser type, pages visited, and interaction patterns to improve our service.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use collected information to operate and improve NestDirect, facilitate property transactions between buyers and sellers, send relevant notifications and updates, provide customer support, and ensure platform security. We never sell your personal data to third parties.",
  },
  {
    title: "Information Sharing",
    content:
      "We share your information only with other NestDirect users as necessary to facilitate property inquiries and transactions (e.g., your contact details with interested buyers). We may also share data with service providers who assist in operating our platform, or when required by law.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures including encryption, secure servers, and regular audits to protect your personal information. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "We use cookies and similar technologies to remember your preferences, analyse traffic, and personalise your experience. You can manage cookie preferences through your browser settings, though disabling cookies may affect platform functionality.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time through your account settings. You can also request a copy of your data or opt out of marketing communications. To exercise these rights, contact us at privacy@nestdirect.com.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of NestDirect after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPolicy() {
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
            Privacy Policy
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
