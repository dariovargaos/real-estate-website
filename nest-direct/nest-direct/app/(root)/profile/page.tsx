"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

//chakra components
import {
  Box,
  Button,
  Card,
  Badge,
  Field,
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
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogPositioner,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";
import { Tooltip } from "../../../components/ui/tooltip";

//react-icons
import { MdInbox, MdSettings } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import {
  FaRegHeart,
  FaBed,
  FaBath,
  FaChevronRight,
  FaRegClock,
  FaCircle,
  FaTrashAlt,
  FaTrash,
  FaExpand,
} from "react-icons/fa";

//hooks
import { useUser } from "../../../hooks/useAuthContext";
import {
  useUserProfile,
  useUserMessages,
  useUserFavorites,
  useUserProperties,
} from "../../../hooks/useProfile";

//utils
import { formatTimeAgo, formatMemberSince } from "../../../lib/utils";
import { deleteProperty, userKeys, propertyKeys } from "../../../lib/api";

//form validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(9, "Phone number is required"),
});
type SettingsFormValues = z.infer<typeof settingsSchema>;

type Section = "inbox" | "favourites" | "listings" | "settings";

interface SidebarItem {
  key: Section;
  label: string;
  icon: ReactNode;
  badge?: number;
}

export default function Profile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const {
    profile,
    loading: profileLoading,
    updateProfile,
    scheduleDeleteAccount,
    cancelDeleteAccount,
  } = useUserProfile();
  const {
    messages,
    loading: messagesLoading,
    markAsRead,
    sendReply,
    deleteMessage,
    deleteConversation,
    useConversation,
  } = useUserMessages();
  const { properties: userProperties, loading: propertiesLoading } =
    useUserProperties();
  const { favorites, loading: favoritesLoading } = useUserFavorites();

  const [activeSection, setActiveSection] = useState<Section>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Delete listing state
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete account state
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isCancellingDeletion, setIsCancellingDeletion] = useState(false);

  const handleDeleteListing = async () => {
    if (!propertyToDelete || !user) return;
    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete.id, user.id);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.properties(user.id),
        }),
        queryClient.invalidateQueries({ queryKey: propertyKeys.lists() }),
        queryClient.removeQueries({
          queryKey: propertyKeys.detail(propertyToDelete.id),
        }),
      ]);
      toaster.create({
        title: "Listing deleted",
        description: "Your property listing has been removed.",
        type: "success",
        duration: 4000,
        closable: true,
      });
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toaster.create({
        title: "Failed to delete listing",
        description: msg,
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Settings form with validation
  const {
    register: registerSettings,
    handleSubmit: handleSettingsSubmit,
    reset: resetSettingsForm,
    formState: { errors: settingsErrors, isSubmitting: isSaving },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { fullName: "", email: "", phone: "" },
  });

  // Initialize settings form with profile data
  useEffect(() => {
    if (profile) {
      resetSettingsForm({
        email: profile.email || "",
        phone: profile.phone || "",
        fullName: profile.full_name || "",
      });
    }
  }, [profile, resetSettingsForm]);

  // Redirect to home page when user logs out
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/");
    }
  }, [user, userLoading, router]);

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

  const handleSaveSettings = async (data: SettingsFormValues) => {
    if (!profile) return;

    try {
      const result = await updateProfile({
        email: data.email,
        phone: data.phone,
        full_name: data.fullName || "",
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
    } catch (error: unknown) {
      toaster.create({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountDialogOpen(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const result = await scheduleDeleteAccount();
      if (result.success) {
        toaster.create({
          title: "Account deletion scheduled",
          description:
            "Your account will be permanently deleted in 7 days. You can cancel this at any time from Settings.",
          type: "info",
          duration: 8000,
          closable: true,
        });
        setIsDeleteAccountDialogOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toaster.create({
        title: "Failed to schedule deletion",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleCancelDeletion = async () => {
    setIsCancellingDeletion(true);
    try {
      const result = await cancelDeleteAccount();
      if (result.success) {
        toaster.create({
          title: "Deletion cancelled",
          description:
            "Your account deletion has been cancelled. Your account is safe.",
          type: "success",
          duration: 5000,
          closable: true,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toaster.create({
        title: "Failed to cancel deletion",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      });
    } finally {
      setIsCancellingDeletion(false);
    }
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
    } catch (error: unknown) {
      toaster.create({
        title: "Send failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      });
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedMsg || !user?.id) return;

    try {
      // Determine the other user in the conversation
      const otherUserId =
        selectedMsg.sender_id === user.id
          ? selectedMsg.recipient_id || ""
          : selectedMsg.sender_id || "";

      const result = await deleteConversation(
        otherUserId,
        selectedMsg.property_id || "",
      );

      if (result.success) {
        toaster.create({
          title: "Conversation deleted",
          description:
            "The conversation has been deleted. The other person can still see the messages.",
          type: "success",
          duration: 5000,
        });
        setSelectedMessage(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toaster.create({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      });
    }
  };

  const selectedMsg = messages.find((m) => m.id === selectedMessage);

  // Get conversation messages for selected message
  const {
    data: conversationMessages,
    isLoading: conversationLoading,
    error: conversationError,
  } = useConversation(
    selectedMsg?.sender_id || undefined,
    selectedMsg?.property_id || undefined,
  );

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
          <Spinner size="lg" color="hsl(35, 80%, 56%)" />
          <Text>Redirecting to home page</Text>
        </VStack>
      </Box>
    );
  }

  // Get display name
  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";

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
                        justifyContent={{ base: "center", md: "flex-start" }}
                        flex={{ base: 1, md: "none" }}
                        w={{ base: "auto", md: "full" }}
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
                            <Box
                              onClick={() => {
                                setSelectedMessage(msg.id);
                                if (!msg.is_read) {
                                  markAsRead(msg.id);
                                }
                              }}
                              cursor="pointer"
                              w="full"
                              px={6}
                              py={4}
                              _hover={{
                                bg: "gray.50",
                              }}
                              transition="background 0.2s"
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
                                <HStack flexShrink={0} mt={2} gap={1}>
                                  <Icon size="xs" color="gray.400">
                                    <FaChevronRight />
                                  </Icon>
                                </HStack>
                              </HStack>
                            </Box>
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
                    <Flex justify="space-between" align="start">
                      <Box>
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
                      </Box>
                      <IconButton
                        onClick={() => handleDeleteConversation()}
                        variant="outline"
                        size="sm"
                        color="red.600"
                        borderColor="red.300"
                        _hover={{
                          bg: "red.50",
                          borderColor: "red.400",
                          color: "red.700",
                        }}
                        title="Delete conversation"
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </Flex>
                  </Card.Header>
                  <Card.Body>
                    {/* Conversation Messages */}
                    <Box
                      h="400px"
                      overflowY="auto"
                      bg="gray.50"
                      rounded="xl"
                      p={4}
                      mb={4}
                    >
                      {conversationLoading ? (
                        <VStack gap={3} justify="center" h="full">
                          <Spinner color="hsl(35, 80%, 56%)" />
                          <Text fontSize="sm" color="gray.500">
                            Loading conversation...
                          </Text>
                        </VStack>
                      ) : conversationError ? (
                        <VStack gap={3} justify="center" h="full">
                          <Text fontSize="sm" color="red.500">
                            Failed to load conversation
                          </Text>
                        </VStack>
                      ) : (
                        <VStack gap={4} align="stretch">
                          {conversationMessages?.map((msg) => (
                            <Flex
                              key={msg.id}
                              direction={
                                msg.sender_id === user?.id
                                  ? "row-reverse"
                                  : "row"
                              }
                            >
                              <Box
                                maxW="70%"
                                bg={
                                  msg.sender_id === user?.id
                                    ? "hsl(35, 80%, 56%)"
                                    : "white"
                                }
                                color={
                                  msg.sender_id === user?.id ? "white" : "black"
                                }
                                p={3}
                                rounded="lg"
                                shadow="sm"
                              >
                                <Text fontSize="sm" mb={1}>
                                  {msg.content}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  opacity={0.7}
                                  textAlign={
                                    msg.sender_id === user?.id
                                      ? "right"
                                      : "left"
                                  }
                                >
                                  {msg.created_at
                                    ? formatTimeAgo(msg.created_at)
                                    : "Unknown time"}
                                </Text>
                              </Box>
                            </Flex>
                          ))}
                        </VStack>
                      )}
                    </Box>

                    {/* Reply Input */}
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
                        disabled={!replyText.trim()}
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
                                      <Text>{fav.property.rooms}</Text>
                                    </HStack>
                                    <HStack gap={1}>
                                      <FaBath size={12} />
                                      <Text>{fav.property.baths}</Text>
                                    </HStack>
                                    <Text>{fav.property.size_m2}</Text>
                                  </HStack>
                                  <Text
                                    fontSize="base"
                                    fontWeight="semibold"
                                    color="hsl(35, 80%, 56%)"
                                  >
                                    {`€${fav.property.price.toLocaleString()}`}
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
                    <Link href="/list-property">
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
                        <Link href={`/property/${prop.id}`} key={prop.id}>
                          <Card.Root
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
                                        <Text>{prop.rooms}</Text>
                                      </HStack>
                                      <HStack gap={1}>
                                        <FaBath size={12} />
                                        <Text>{prop.baths}</Text>
                                      </HStack>
                                      <HStack gap={1}>
                                        <FaExpand size={12} />
                                        <Text>{prop.size_m2}m²</Text>
                                      </HStack>
                                    </HStack>

                                    <Text
                                      fontSize="base"
                                      fontWeight="semibold"
                                      color="hsl(35, 80%, 56%)"
                                    >
                                      {`€${prop.price.toLocaleString()}`}
                                    </Text>
                                  </VStack>
                                  <Flex gap={2}>
                                    <Badge
                                      variant="outline"
                                      rounded="xl"
                                      flexShrink={0}
                                      fontSize="xs"
                                      fontWeight="bold"
                                    >
                                      Active
                                    </Badge>
                                    <Tooltip content="Delete listing" showArrow>
                                      <IconButton
                                        aria-label="Delete listing"
                                        variant="outline"
                                        size="xs"
                                        color="red.400"
                                        _hover={{
                                          color: "red.600",
                                          bg: "red.50",
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setPropertyToDelete({
                                            id: prop.id,
                                            title: prop.title,
                                          });
                                          setIsDeleteDialogOpen(true);
                                        }}
                                      >
                                        <FaTrash />
                                      </IconButton>
                                    </Tooltip>
                                  </Flex>
                                </Flex>
                              </Card.Body>
                            </Flex>
                          </Card.Root>
                        </Link>
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
                      <Box
                        as="form"
                        onSubmit={handleSettingsSubmit(handleSaveSettings)}
                      >
                        <VStack gap={4} align="stretch">
                          <Field.Root invalid={!!settingsErrors.fullName}>
                            <Field.Label
                              fontSize="sm"
                              fontWeight="medium"
                              mb={1.5}
                            >
                              Full Name
                            </Field.Label>
                            <Input
                              type="text"
                              {...registerSettings("fullName")}
                              bg="gray.100"
                            />
                            <Field.ErrorText fontSize="xs">
                              {settingsErrors.fullName?.message}
                            </Field.ErrorText>
                          </Field.Root>
                          <Field.Root invalid={!!settingsErrors.email}>
                            <Field.Label
                              fontSize="sm"
                              fontWeight="medium"
                              mb={1.5}
                            >
                              Email Address
                            </Field.Label>
                            <Input
                              type="email"
                              {...registerSettings("email")}
                              bg="gray.100"
                            />
                            <Field.ErrorText fontSize="xs">
                              {settingsErrors.email?.message}
                            </Field.ErrorText>
                          </Field.Root>
                          <Field.Root required invalid={!!settingsErrors.phone}>
                            <Field.Label
                              fontSize="sm"
                              fontWeight="medium"
                              mb={1.5}
                            >
                              Phone Number
                            </Field.Label>
                            <Input
                              type="tel"
                              {...registerSettings("phone")}
                              bg="gray.100"
                            />
                            <Field.ErrorText fontSize="xs">
                              {settingsErrors.phone?.message}
                            </Field.ErrorText>
                          </Field.Root>
                          <Button
                            type="submit"
                            loading={isSaving}
                            disabled={isSaving}
                            colorPalette="gray"
                            alignSelf="start"
                            rounded="xl"
                          >
                            Save Changes
                          </Button>
                        </VStack>
                      </Box>
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
                      {profile?.deletion_scheduled_at ? (
                        <VStack align="start" gap={3}>
                          <Box
                            bg="red.50"
                            border="1px solid"
                            borderColor="red.200"
                            rounded="xl"
                            p={4}
                            w="full"
                          >
                            <Text
                              fontSize="sm"
                              color="red.700"
                              fontWeight="semibold"
                              mb={1}
                            >
                              Account deletion scheduled
                            </Text>
                            <Text fontSize="sm" color="red.600">
                              Your account will be permanently deleted on{" "}
                              <Text as="span" fontWeight="semibold">
                                {new Date(
                                  profile.deletion_scheduled_at,
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </Text>
                              . All your listings, messages, and data will be
                              removed.
                            </Text>
                          </Box>
                          <Button
                            variant="outline"
                            colorPalette="gray"
                            onClick={handleCancelDeletion}
                            loading={isCancellingDeletion}
                            disabled={isCancellingDeletion}
                            rounded="xl"
                          >
                            Cancel Deletion
                          </Button>
                        </VStack>
                      ) : (
                        <Button
                          variant="solid"
                          colorPalette="red"
                          onClick={handleDeleteAccount}
                          rounded="xl"
                        >
                          <FaTrashAlt />
                          Delete Account
                        </Button>
                      )}
                    </Card.Body>
                  </Card.Root>
                </VStack>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <DialogRoot
        open={isDeleteAccountDialogOpen}
        onOpenChange={(details) => {
          if (!isDeletingAccount) {
            setIsDeleteAccountDialogOpen(details.open);
          }
        }}
        role="alertdialog"
        placement="center"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent rounded="2xl" maxW="md" mx={4}>
            <DialogHeader>
              <DialogTitle
                fontFamily="DM Serif Display, serif"
                fontWeight="medium"
              >
                Delete Account
              </DialogTitle>
              <DialogCloseTrigger disabled={isDeletingAccount} />
            </DialogHeader>
            <DialogBody>
              <VStack align="start" gap={3}>
                <Text color="gray.600" fontSize="sm">
                  Are you sure you want to delete your account? Your account
                  will be permanently removed after a{" "}
                  <Text as="span" fontWeight="semibold" color="gray.800">
                    7-day grace period
                  </Text>
                  .
                </Text>
                <Text color="gray.600" fontSize="sm">
                  During this time you can cancel the deletion from Settings.
                  After 7 days, all your listings, messages, and personal data
                  will be permanently removed.
                </Text>
              </VStack>
            </DialogBody>
            <DialogFooter gap={3}>
              <Button
                colorPalette="gray"
                rounded="xl"
                onClick={() => setIsDeleteAccountDialogOpen(false)}
                disabled={isDeletingAccount}
              >
                Cancel
              </Button>
              <Button
                colorPalette="red"
                rounded="xl"
                onClick={handleConfirmDeleteAccount}
                loading={isDeletingAccount}
                disabled={isDeletingAccount}
              >
                <FaTrash />
                Schedule Deletion
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Delete Listing Confirmation Dialog */}
      <DialogRoot
        open={isDeleteDialogOpen}
        onOpenChange={(details) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(details.open);
            if (!details.open) setPropertyToDelete(null);
          }
        }}
        role="alertdialog"
        placement="center"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent rounded="2xl" maxW="md" mx={4}>
            <DialogHeader>
              <DialogTitle
                fontFamily="DM Serif Display, serif"
                fontWeight="medium"
              >
                Delete Listing
              </DialogTitle>
              <DialogCloseTrigger disabled={isDeleting} />
            </DialogHeader>
            <DialogBody>
              <Text color="gray.600" fontSize="sm">
                Are you sure you want to delete{" "}
                <Text as="span" fontWeight="semibold" color="gray.800">
                  {propertyToDelete?.title}
                </Text>
                ? This action cannot be undone.
              </Text>
            </DialogBody>
            <DialogFooter gap={3}>
              <Button
                colorPalette="gray"
                rounded="xl"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setPropertyToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                colorPalette="red"
                rounded="xl"
                onClick={handleDeleteListing}
                loading={isDeleting}
                disabled={isDeleting}
              >
                <FaTrash />
                Delete Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <Toaster />
    </Box>
  );
}
