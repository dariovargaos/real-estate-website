"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

//chakra components
import {
  Box,
  Button,
  Card,
  Badge,
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  Flex,
  Container,
  Separator,
  IconButton,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";

//react-icons
import { MdInbox, MdSettings } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import {
  FaRegHeart,
  FaTrash,
  FaBed,
  FaBath,
  FaChevronRight,
  FaRegClock,
  FaCircle,
} from "react-icons/fa";

//hooks
import { useUser } from "../../../hooks/useAuthContext";
import {
  useUserProfile,
  useUserMessages,
  useUserFavorites,
  useUserProperties,
} from "../../../hooks/useProfile";
import { formatTimeAgo, formatMemberSince } from "../../../lib/utils";

type Section = "inbox" | "favourites" | "listings" | "settings";

interface SidebarItem {
  key: Section;
  label: string;
  icon: ReactNode;
  badge?: number;
}

export default function Profile() {
  const { user, isLoading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const {
    messages,
    loading: messagesLoading,
    markAsRead,
    sendReply,
  } = useUserMessages();
  const { properties: userProperties, loading: propertiesLoading } =
    useUserProperties();
  const { favorites, loading: favoritesLoading } = useUserFavorites();

  const [activeSection, setActiveSection] = useState<Section>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Settings state - initialized from profile data
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings form with profile data
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  // Calculate unread messages count
  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  // Create sidebar items with dynamic badge
  const sidebarItems: SidebarItem[] = [
    {
      key: "inbox",
      label: "Inbox",
      icon: <MdInbox />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { key: "favourites", label: "Favourites", icon: <FaRegHeart /> },
    { key: "listings", label: "My Listings", icon: <LuHouse /> },
    { key: "settings", label: "Settings", icon: <MdSettings /> },
  ];

  const handleSaveSettings = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const result = await updateProfile({
        email: email,
        phone: phone,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      });

      if (result.success) {
        toaster.create({
          title: "Settings saved",
          description: "Your profile has been updated successfully.",
          type: "success",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toaster.create({
        title: "Save failed",
        description: error.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    toaster.create({
      title: "Account deletion requested",
      description: "This feature is available once backend is connected.",
      type: "error",
    });
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    try {
      const result = await sendReply(selectedMessage, replyText);

      if (result.success) {
        toaster.create({
          title: "Message sent",
          description: "Your reply has been sent successfully.",
          type: "success",
        });
        setReplyText("");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toaster.create({
        title: "Send failed",
        description: error.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  const selectedMsg = messages.find((m) => m.id === selectedMessage);

  // Show loading state
  if (userLoading || profileLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#FCFAF8"
      >
        <VStack gap={4}>
          <Spinner size="lg" color="hsl(35, 80%, 56%)" />
          <Text>Loading profile...</Text>
        </VStack>
      </Box>
    );
  }

  // Show error state if user not found
  if (!user) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#FCFAF8"
      >
        <VStack gap={4}>
          <Text>Please sign in to view your profile.</Text>
          <Button asChild colorPalette="gray" rounded="xl">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </VStack>
      </Box>
    );
  }

  // Get display name
  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name
        ? profile.first_name
        : user.email?.split("@")[0] || "User";

  const memberSince = profile?.created_at
    ? formatMemberSince(profile.created_at)
    : "Member since 2024";
  const listingsCount = userProperties.length;

  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="#FCFAF8">
      <Box flex={1} pt={16}>
        <Container maxW="7xl" px={4} py={8}>
          {/* Profile Header */}
          <HStack gap={4} mb={8}>
            <Flex
              h={14}
              w={14}
              rounded="full"
              bg="#F9E8D1"
              align="center"
              justify="center"
            >
              <FiUser size={28} color="hsl(35, 80%, 56%)" />
            </Flex>
            <VStack align="start" gap={0}>
              <Heading
                as="h1"
                size="xl"
                fontFamily="DM Serif Display, serif"
                fontWeight="medium"
                color="foreground"
              >
                {displayName}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {memberSince} · {listingsCount} active listings
              </Text>
            </VStack>
          </HStack>

          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            {/* Sidebar */}
            <Box as="aside" w={{ base: "full", md: 60 }} flexShrink={0}>
              <Card.Root>
                <Card.Body p={2}>
                  <Flex
                    as="nav"
                    direction={{ base: "row", md: "column" }}
                    gap={1}
                    wrap={{ base: "wrap", md: "nowrap" }}
                  >
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.key}
                        onClick={() => {
                          setActiveSection(item.key);
                          setSelectedMessage(null);
                        }}
                        variant={
                          activeSection === item.key ? "subtle" : "ghost"
                        }
                        color={
                          activeSection === item.key
                            ? "hsl(35, 80%, 56%)"
                            : "gray.500"
                        }
                        bg={activeSection === item.key ? "#FCF5EA" : "white"}
                        _hover={{
                          color: "black",
                          bg: "gray.100",
                        }}
                        justifyContent="flex-start"
                        w="full"
                        px={3}
                        py={2.5}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        <HStack gap={3} w="full">
                          <Box flexShrink={0}>{item.icon}</Box>
                          <Text display={{ base: "none", md: "inline" }}>
                            {item.label}
                          </Text>
                          {item.badge && (
                            <Badge
                              variant="subtle"
                              color="white"
                              bg="hsl(35, 80%, 56%)"
                              size="sm"
                              ml="auto"
                              rounded="full"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </HStack>
                      </Button>
                    ))}
                  </Flex>
                </Card.Body>
              </Card.Root>
            </Box>

            {/* Main Content */}
            <Box as="main" flex={1} minW={0}>
              {/* INBOX */}
              {activeSection === "inbox" && !selectedMessage && (
                <Card.Root>
                  <Card.Header>
                    <Card.Title
                      as="h2"
                      fontSize="xl"
                      fontFamily="DM Serif Display, serif"
                    >
                      Inbox
                    </Card.Title>
                    <Card.Description color="gray.500">
                      Messages from interested buyers
                    </Card.Description>
                  </Card.Header>
                  <Card.Body p={0}>
                    {messagesLoading ? (
                      <Box p={6} textAlign="center">
                        <Spinner color="hsl(35, 80%, 56%)" />
                        <Text mt={2}>Loading messages...</Text>
                      </Box>
                    ) : messages.length === 0 ? (
                      <Box p={12} textAlign="center">
                        <VStack gap={3}>
                          <MdInbox
                            size={40}
                            color="hsl(220, 10%, 46%)"
                            opacity={0.4}
                          />
                          <Text color="gray.500">No messages yet.</Text>
                        </VStack>
                      </Box>
                    ) : (
                      <VStack gap={0} align="stretch">
                        {messages.map((msg, i) => (
                          <Box key={msg.id}>
                            <Button
                              onClick={() => {
                                setSelectedMessage(msg.id);
                                if (!msg.is_read) {
                                  markAsRead(msg.id);
                                }
                              }}
                              variant="ghost"
                              w="full"
                              textAlign="left"
                              px={6}
                              py={4}
                              h="auto"
                              justifyContent="flex-start"
                            >
                              <HStack align="start" gap={3} w="full">
                                <Box>
                                  <Icon size="xs">
                                    <FaCircle
                                      color={
                                        !msg.is_read
                                          ? "hsl(35, 80%, 56%)"
                                          : "transparent"
                                      }
                                    />
                                  </Icon>
                                </Box>
                                <VStack flex={1} minW={0} align="start" gap={1}>
                                  <HStack justify="between" w="full">
                                    <Text
                                      fontSize="sm"
                                      fontWeight={
                                        !msg.is_read ? "semibold" : "medium"
                                      }
                                      color={
                                        !msg.is_read ? "black" : "gray.500"
                                      }
                                    >
                                      {msg.sender_name}
                                    </Text>
                                    <HStack fontSize="xs" gap={1}>
                                      <Icon size="xs" color="gray.400">
                                        <FaRegClock />
                                      </Icon>
                                      <Text color="gray.400">
                                        {msg.created_at
                                          ? formatTimeAgo(msg.created_at)
                                          : "Unknown"}
                                      </Text>
                                    </HStack>
                                  </HStack>
                                  <Text fontSize="xs" color="gray.400" mb={1}>
                                    Re: {msg.property?.title || "Property"}
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="black"
                                    opacity={0.8}
                                    lineClamp={{ base: "1", md: "none" }}
                                  >
                                    {msg.content}
                                  </Text>
                                </VStack>
                                <Box flexShrink={0} mt={2}>
                                  <Icon size="xs" color="gray.400">
                                    <FaChevronRight />
                                  </Icon>
                                </Box>
                              </HStack>
                            </Button>
                            {i < messages.length - 1 && <Separator />}
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Card.Body>
                </Card.Root>
              )}

              {activeSection === "inbox" && selectedMessage && selectedMsg && (
                <Card.Root>
                  <Card.Header>
                    <Button
                      onClick={() => setSelectedMessage(null)}
                      variant="plain"
                      fontSize="sm"
                      color="hsl(35, 80%, 56%)"
                      alignSelf="flex-start"
                      mb={2}
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      ← Back to Inbox
                    </Button>
                    <Card.Title
                      as="h2"
                      fontSize="lg"
                      fontFamily="DM Serif Display, serif"
                    >
                      {selectedMsg.sender_name}
                    </Card.Title>
                    <Card.Description>
                      Re:{" "}
                      <Link href={`/property/${selectedMsg.property_id}`}>
                        <Text
                          as="span"
                          color="hsl(35, 80%, 56%)"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {selectedMsg.property?.title || "Property"}
                        </Text>
                      </Link>
                    </Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <Box bg="gray.100" rounded="xl" p={4} mb={6}>
                      <Text fontSize="sm" color="foreground">
                        {selectedMsg.content}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        {selectedMsg.created_at
                          ? formatTimeAgo(selectedMsg.created_at)
                          : "Unknown time"}
                      </Text>
                    </Box>
                    <HStack gap={2}>
                      <Input
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendReply()
                        }
                        flex={1}
                        rounded="xl"
                        bg="gray.100"
                      />
                      <IconButton
                        onClick={handleSendReply}
                        colorPalette="gray"
                        rounded="xl"
                      >
                        <IoPaperPlaneOutline />
                      </IconButton>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              )}

              {/* FAVOURITES */}
              {activeSection === "favourites" && (
                <VStack align="stretch" gap={4}>
                  <Heading
                    as="h2"
                    fontSize="xl"
                    fontFamily="DM Serif Display, serif"
                    fontWeight="medium"
                  >
                    Favourites
                  </Heading>
                  {favoritesLoading ? (
                    <Card.Root>
                      <Card.Body py={12} textAlign="center">
                        <VStack gap={3}>
                          <Spinner color="hsl(35, 80%, 56%)" />
                          <Text>Loading favorites...</Text>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  ) : favorites.length === 0 ? (
                    <Card.Root>
                      <Card.Body py={12} textAlign="center">
                        <VStack gap={3}>
                          <FaRegHeart
                            size={40}
                            color="hsl(220, 10%, 46%)"
                            opacity={0.4}
                          />
                          <Text color="muted.foreground">
                            No favourites yet. Browse properties and save the
                            ones you love.
                          </Text>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  ) : (
                    <VStack gap={4} align="stretch">
                      {favorites.map((fav) => (
                        <Link
                          href={`/property/${fav.property.id}`}
                          key={fav.id}
                        >
                          <Card.Root
                            overflow="hidden"
                            _hover={{
                              shadow: "md",
                              transform: "translateY(-1px)",
                              transition: "all 0.2s",
                            }}
                            cursor="pointer"
                            rounded="xl"
                          >
                            <Flex direction={{ base: "column", sm: "row" }}>
                              <Box
                                w={{ base: "full", sm: 48 }}
                                h={36}
                                overflow="hidden"
                              >
                                <Image
                                  src={fav.property.image}
                                  alt={fav.property.title}
                                  width={192}
                                  height={144}
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              </Box>
                              <Card.Body flex={1} p={4}>
                                <VStack align="start" gap={1}>
                                  <Heading
                                    as="h3"
                                    size="md"
                                    fontFamily="DM Serif Display, serif"
                                    fontWeight="thin"
                                  >
                                    {fav.property.title}
                                  </Heading>
                                  <HStack
                                    fontSize="sm"
                                    color="gray.500"
                                    gap={1}
                                  >
                                    <Icon color="gray.500" strokeWidth={1}>
                                      <CiLocationOn />
                                    </Icon>
                                    <Text>{fav.property.location}</Text>
                                  </HStack>
                                  <HStack
                                    gap={4}
                                    fontSize="xs"
                                    color="gray.500"
                                    mb={2}
                                  >
                                    <HStack gap={1}>
                                      <FaBed size={12} />
                                      <Text>{fav.property.beds}</Text>
                                    </HStack>
                                    <HStack gap={1}>
                                      <FaBath size={12} />
                                      <Text>{fav.property.baths}</Text>
                                    </HStack>
                                    <Text>{fav.property.sqft}</Text>
                                  </HStack>
                                  <Text
                                    fontSize="base"
                                    fontWeight="semibold"
                                    color="hsl(35, 80%, 56%)"
                                  >
                                    {fav.property.price}
                                  </Text>
                                </VStack>
                              </Card.Body>
                            </Flex>
                          </Card.Root>
                        </Link>
                      ))}
                    </VStack>
                  )}
                </VStack>
              )}

              {/* MY LISTINGS */}
              {activeSection === "listings" && (
                <VStack align="stretch" gap={4}>
                  <Flex justify="space-between" align="center">
                    <Heading
                      as="h2"
                      fontSize="xl"
                      fontFamily="DM Serif Display, serif"
                      fontWeight="medium"
                    >
                      My Listings
                    </Heading>
                    <Link href="/listproperty">
                      <Button size="xs" colorPalette="gray" rounded="xl">
                        + New Listing
                      </Button>
                    </Link>
                  </Flex>
                  {propertiesLoading ? (
                    <Card.Root>
                      <Card.Body py={12} textAlign="center">
                        <VStack gap={3}>
                          <Spinner color="hsl(35, 80%, 56%)" />
                          <Text>Loading properties...</Text>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  ) : userProperties.length === 0 ? (
                    <Card.Root>
                      <Card.Body py={12} textAlign="center">
                        <VStack gap={4}>
                          <LuHouse
                            size={40}
                            color="hsl(220, 10%, 46%)"
                            opacity={0.4}
                          />
                          <Text color="gray.500">No listings yet.</Text>
                          <Button asChild colorPalette="gray" rounded="xl">
                            <Link href="/list-property">
                              Create Your First Listing
                            </Link>
                          </Button>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  ) : (
                    <VStack gap={4} align="stretch">
                      {userProperties.map((prop) => (
                        <Card.Root
                          key={prop.id}
                          rounded={"xl"}
                          cursor="pointer"
                          overflow="hidden"
                          _hover={{
                            shadow: "md",
                            transform: "translateY(-1px)",
                            transition: "all 0.2s",
                          }}
                        >
                          <Flex direction={{ base: "column", sm: "row" }}>
                            <Box
                              w={{ base: "full", sm: 48 }}
                              h={36}
                              overflow="hidden"
                            >
                              <Image
                                src={prop.image}
                                alt={prop.title}
                                width={192}
                                height={144}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            </Box>
                            <Card.Body flex={1} p={4}>
                              <Flex align="start" justify="space-between">
                                <VStack align="start" gap={1}>
                                  <Heading
                                    as="h3"
                                    size="md"
                                    fontFamily={"DM Serif Display, serif"}
                                    fontWeight="thin"
                                    lineClamp={{ base: "1", md: "none" }}
                                  >
                                    {prop.title}
                                  </Heading>
                                  <HStack fontSize="sm" gap={1}>
                                    <Icon strokeWidth={1} color="gray.500">
                                      <CiLocationOn />
                                    </Icon>

                                    <Text color="gray.500">
                                      {prop.location}
                                    </Text>
                                  </HStack>
                                  <HStack
                                    gap={4}
                                    fontSize="xs"
                                    color="gray.500"
                                    mb={2}
                                  >
                                    <HStack gap={1}>
                                      <FaBed size={12} />
                                      <Text>{prop.beds}</Text>
                                    </HStack>
                                    <HStack gap={1}>
                                      <FaBath size={12} />
                                      <Text>{prop.baths}</Text>
                                    </HStack>
                                    <Text>{prop.sqft}</Text>
                                  </HStack>
                                  <Text
                                    fontSize="base"
                                    fontWeight="semibold"
                                    color="hsl(35, 80%, 56%)"
                                  >
                                    {prop.price}
                                  </Text>
                                </VStack>
                                <Badge
                                  variant="outline"
                                  rounded="xl"
                                  flexShrink={0}
                                  fontSize="xs"
                                  fontWeight="bold"
                                >
                                  Active
                                </Badge>
                              </Flex>
                            </Card.Body>
                          </Flex>
                        </Card.Root>
                      ))}
                    </VStack>
                  )}
                </VStack>
              )}

              {/* SETTINGS */}
              {activeSection === "settings" && (
                <VStack gap={6} align="stretch">
                  <Card.Root rounded="xl">
                    <Card.Header>
                      <Card.Title
                        fontSize="xl"
                        fontFamily="DM Serif Display, serif"
                      >
                        Profile Settings
                      </Card.Title>
                      <Card.Description>
                        Update your personal information
                      </Card.Description>
                    </Card.Header>
                    <Card.Body>
                      <VStack gap={4} align="stretch">
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                            First Name
                          </Text>
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            bg="gray.100"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                            Last Name
                          </Text>
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            bg="gray.100"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                            Email Address
                          </Text>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            bg="gray.100"
                          />
                        </Box>
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="foreground"
                            mb={1.5}
                          >
                            Phone Number
                          </Text>
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            bg="gray.100"
                          />
                        </Box>
                        <Button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          colorPalette="gray"
                          alignSelf="start"
                          rounded="xl"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </VStack>
                    </Card.Body>
                  </Card.Root>

                  <Card.Root borderColor="red.300" rounded="xl">
                    <Card.Header>
                      <Card.Title
                        fontSize="lg"
                        color="red.500"
                        fontFamily="DM Serif Display, serif"
                      >
                        Danger Zone
                      </Card.Title>
                      <Card.Description color="gray.500">
                        Permanently delete your account and all associated data.
                      </Card.Description>
                    </Card.Header>
                    <Card.Body>
                      <Button
                        variant="solid"
                        colorPalette="red"
                        onClick={handleDeleteAccount}
                        rounded="xl"
                      >
                        <FaTrash />
                        Delete Account
                      </Button>
                    </Card.Body>
                  </Card.Root>
                </VStack>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
      <Toaster />
    </Box>
  );
}
