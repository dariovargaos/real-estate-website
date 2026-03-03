"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Circle,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";

//icons
import { CiLocationOn, CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";

const contactInfo = [
  { icon: CiMail, label: "Email", value: "support@nestdirect.com" },
  { icon: LuPhone, label: "Phone", value: "+1 (555) 123-4567" },
  {
    icon: CiLocationOn,
    label: "Office",
    value: "123 Market St, San Francisco, CA",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    toaster.create({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
      type: "success",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Box minH="100vh" bg="#FCFAF8">
      <Box as="main" pt="24" pb="16">
        <Container maxW="5xl" px="4">
          <Box textAlign="center" mb="12">
            <Heading
              as="h1"
              size={{ base: "3xl", md: "4xl" }}
              fontFamily="DM Serif Display, serif"
              fontWeight="medium"
              mb="4"
            >
              Get in Touch
            </Heading>
            <Text color="gray.500" maxW="xl" mx="auto" textStyle="md">
              Have a question or need assistance? We&apos;re here to help you
              with anything related to buying, selling, or listing properties.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="8" mb="12">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <Card.Root key={label} p="6" textAlign="center" rounded="xl">
                <Card.Body>
                  <Circle
                    size="10"
                    bg="#FCF5EA"
                    color="gray.fg"
                    mx="auto"
                    mb="3"
                  >
                    <Icon size="20" color="#E99E35" strokeWidth={1} />
                  </Circle>
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="DM Serif Display, serif"
                    fontWeight="medium"
                    mb="1"
                  >
                    {label}
                  </Heading>
                  <Text color="gray.500" textStyle="sm">
                    {value}
                  </Text>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>

          <Card.Root maxW="2xl" mx="auto" p="8" rounded="xl">
            <Card.Body>
              <Heading
                as="h2"
                size="2xl"
                fontFamily="DM Serif Display, serif"
                fontWeight="medium"
                mb="6"
              >
                Send us a message
              </Heading>
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap="4">
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                    <Field.Root>
                      <Input
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        rounded="xl"
                        bg="#FCFAF8"
                        required
                      />
                    </Field.Root>
                    <Field.Root>
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        rounded="xl"
                        bg="#FCFAF8"
                        required
                      />
                    </Field.Root>
                  </SimpleGrid>
                  <Field.Root>
                    <Input
                      placeholder="Subject"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      rounded="xl"
                      bg="#FCFAF8"
                      required
                    />
                  </Field.Root>
                  <Field.Root>
                    <Textarea
                      placeholder="Your message..."
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      rounded="xl"
                      bg="#FCFAF8"
                      required
                    />
                  </Field.Root>
                  <Button
                    type="submit"
                    w="full"
                    gap="2"
                    colorScheme="gray"
                    rounded="xl"
                  >
                    <IoPaperPlaneOutline />
                    Send Message
                  </Button>
                </Stack>
              </Box>
            </Card.Body>
          </Card.Root>
        </Container>
      </Box>
      <Toaster />
    </Box>
  );
}
