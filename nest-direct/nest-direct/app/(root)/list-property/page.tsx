"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  Box,
  Flex,
  Stack,
  Grid,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Icon,
  Field,
  NativeSelect,
  Separator,
  Spinner,
  FileUpload,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../../components/ui/toaster";

//hooks
import { useUser } from "../../../hooks/useAuthContext";
import { useProperty } from "../../../hooks/useProperty";
import { useUserProfile } from "../../../hooks/useProfile";

//api
import { createProperty, updateProperty, propertyKeys } from "../../../lib/api";

//icons
import { FaEuroSign, FaCheckCircle } from "react-icons/fa";
import { LuHouse, LuMapPin, LuUpload, LuX } from "react-icons/lu";

export default function ListProperty() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const editId = searchParams?.get("edit");
  const isEditMode = !!editId;

  // Fetch property data if editing
  const { data: editProperty, isLoading: editLoading } = useProperty(
    editId || undefined,
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    property_type: "",
    beds: "",
    baths: "",
    size_m2: "",
    description: "",
    seller_phone: "",
  });

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditMode && editProperty && !editLoading) {
      setFormData({
        title: editProperty.title || "",
        price: editProperty.price?.replace(/[^0-9]/g, "") || "",
        location: editProperty.location || "",
        property_type: editProperty.type || "",
        beds: editProperty.beds?.toString() || "",
        baths: editProperty.baths?.toString() || "",
        size_m2: editProperty.size_m2?.toString() || "",
        description: editProperty.description || "",
        seller_phone: editProperty.seller_phone || "",
      });
    }
  }, [isEditMode, editProperty, editLoading]);

  // Redirect to home if user is not authenticated (client-side protection)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!user) {
      toaster.create({
        title: "Authentication required",
        description: "Please sign in to list a property.",
        type: "error",
        duration: 5000,
        closable: true,
      });
      return;
    }

    // Validate required fields
    const requiredFields = {
      title: "Property Title",
      price: "Asking Price",
      location: "Location",
      property_type: "Property Type",
      beds: "Bedrooms",
      baths: "Bathrooms",
      size_m2: "Size",
      description: "Description",
      seller_phone: "Phone Number",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData].trim()) {
        toaster.create({
          title: "Missing required field",
          description: `Please fill in ${label}.`,
          type: "error",
          duration: 5000,
          closable: true,
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Debug: Log user object
      console.log("User object:", user);
      console.log("User ID:", user?.id);

      if (isEditMode && editId) {
        await updateProperty(
          editId,
          {
            title: formData.title,
            price: formData.price,
            location: formData.location,
            beds: parseInt(formData.beds),
            baths: parseInt(formData.baths),
            size_m2: formData.size_m2,
            description: formData.description,
            seller_name:
              `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
              user?.user_metadata?.full_name ||
              "Unknown",
            seller_phone: formData.seller_phone,
            property_type: formData.property_type,
            imageFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
          },
          user.id,
        );

        toaster.create({
          title: "Property updated!",
          description: "Your listing has been updated successfully.",
          type: "success",
          duration: 7000,
          closable: true,
        });

        // Invalidate and refetch property data to show changes immediately
        await queryClient.invalidateQueries({
          queryKey: propertyKeys.detail(editId),
        });

        // Also invalidate property lists to update them
        await queryClient.invalidateQueries({
          queryKey: propertyKeys.lists(),
        });

        // Redirect to property detail page
        router.push(`/property/${editId}`);
        return;
      } else {
        await createProperty({
          title: formData.title,
          price: formData.price,
          location: formData.location,
          beds: parseInt(formData.beds),
          baths: parseInt(formData.baths),
          size_m2: formData.size_m2,
          description: formData.description,
          seller_name:
            `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
            user?.user_metadata?.full_name ||
            "Unknown",
          seller_phone: formData.seller_phone,
          user_id: user.id,
          property_type: formData.property_type,
          imageFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        });

        toaster.create({
          title: "Property submitted!",
          description: "We'll review your listing and publish it shortly.",
          type: "success",
          duration: 7000,
          closable: true,
        });
      }

      setSubmitted(true);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 0);
    } catch (error) {
      console.error("Error creating property:", error);
      toaster.create({
        title: "Submission failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting your property.",
        type: "error",
        duration: 7000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication or loading edit data
  if (isLoading || (isEditMode && editLoading)) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack align="center" gap={4}>
          <Spinner size="lg" color="hsl(35, 80%, 56%)" />
          <Text>{isEditMode ? "Loading property data..." : "Loading..."}</Text>
        </Stack>
      </Box>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (submitted) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Flex as="main" pt={16} justify="center" align="center">
          <Box px={4} py={24} textAlign="center" maxW="lg" mx="auto">
            <Flex
              align="center"
              justify="center"
              w={20}
              h={20}
              rounded="full"
              bg="green.100"
              color="green.500"
              mb={6}
              mx="auto"
            >
              <Icon>
                <FaCheckCircle size={24} />
              </Icon>
            </Flex>
            <Heading
              as="h1"
              fontFamily="serif"
              fontSize="4xl"
              color="gray.800"
              mb={4}
            >
              Listing Submitted!
            </Heading>
            <Text color="gray.500" mb={8}>
              Your property has been submitted for review. We&apos;ll notify you
              once it&apos;s live on the marketplace.
            </Text>
            <Button
              colorPalette="gray"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: "",
                  price: "",
                  location: "",
                  property_type: "",
                  beds: "",
                  baths: "",
                  size_m2: "",
                  description: "",
                  seller_phone: "",
                });
                setUploadedFiles([]);
              }}
            >
              <Link href="/list-property">List Another Property</Link>
            </Button>
          </Box>
        </Flex>
        <Toaster />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="main" pt={16}>
        {/* Hero */}
        <Box py={16} bg="#F6F2EE">
          <Flex
            direction="column"
            gap={5}
            px={4}
            textAlign="center"
            maxW="2xl"
            mx="auto"
          >
            <Text
              color="#E99E35"
              fontWeight="semibold"
              fontSize="sm"
              letterSpacing="widest"
              textTransform="uppercase"
              mb={2}
            >
              {isEditMode ? "Update Listing" : "Sell Direct"}
            </Text>
            <Heading
              as="h1"
              fontFamily="DM Serif Display"
              fontSize={{ base: "4xl", md: "5xl" }}
              mb={4}
              fontWeight="thin"
            >
              {isEditMode ? "Edit Your Property" : "List Your Property"}
            </Heading>
            <Text color="gray.500" fontSize="lg">
              {isEditMode
                ? "Update your property details and photos to attract more buyers."
                : "Skip the agents. Reach buyers directly and save thousands in commission fees."}
            </Text>
          </Flex>
        </Box>

        {/* Benefits */}
        <Box py={12} bg="gray.50" borderBottom="1px" borderColor="gray.200">
          <Box px={4}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
              maxW="4xl"
              mx="auto"
              textAlign="center"
            >
              {[
                {
                  icon: FaEuroSign,
                  title: "Zero Commission",
                  desc: "Keep 100% of your sale price — no agent fees.",
                },
                {
                  icon: LuHouse,
                  title: "Full Control",
                  desc: "Manage your listing, photos, and pricing on your terms.",
                },
                {
                  icon: LuMapPin,
                  title: "Wide Reach",
                  desc: "Your property is seen by thousands of active buyers.",
                },
              ].map((b, i) => (
                <Flex key={i} direction="column" align="center">
                  <Flex
                    w={12}
                    h={12}
                    rounded="xl"
                    bg="#F9F1E4"
                    color="#E99E35"
                    align="center"
                    justify="center"
                    mb={3}
                  >
                    <Icon as={b.icon} boxSize={6} />
                  </Flex>
                  <Text
                    fontSize="lg"
                    color="gray.800"
                    mb={1}
                    fontWeight="semibold"
                  >
                    {b.title}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {b.desc}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Form */}
        <Box py={16} bg="gray.50">
          <Box px={4} maxW="2xl" mx="auto">
            <Flex justify="space-between" align="center" mb={8}>
              <Heading
                as="h2"
                fontFamily="DM Serif Display"
                fontSize="3xl"
                fontWeight="thin"
              >
                {isEditMode ? "Update Property Details" : "Property Details"}
              </Heading>
              {isEditMode && (
                <Link href={`/property/${editId}`}>
                  <Button variant="outline" size="sm" rounded="xl">
                    View Listing
                  </Button>
                </Link>
              )}
            </Flex>
            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={6}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Property Title</Field.Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g. Modern Loft in Downtown"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Asking Price (€)</Field.Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="500000"
                      rounded="xl"
                    />
                  </Field.Root>
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Location</Field.Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Property Type</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        placeholder="Select type"
                        borderRadius="xl"
                        value={formData.property_type}
                        onChange={(e) =>
                          handleInputChange("property_type", e.target.value)
                        }
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="land">Land</option>
                        <option value="office">Office space</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                >
                  <Field.Root required>
                    <Field.Label>Bedrooms</Field.Label>
                    <Input
                      id="beds"
                      type="number"
                      value={formData.beds}
                      onChange={(e) =>
                        handleInputChange("beds", e.target.value)
                      }
                      placeholder="3"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Bathrooms</Field.Label>
                    <Input
                      id="baths"
                      type="number"
                      value={formData.baths}
                      onChange={(e) =>
                        handleInputChange("baths", e.target.value)
                      }
                      placeholder="2"
                      rounded="xl"
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>Size (m²)</Field.Label>
                    <Input
                      id="size_m2"
                      type="number"
                      value={formData.size_m2}
                      onChange={(e) =>
                        handleInputChange("size_m2", e.target.value)
                      }
                      placeholder="100"
                      rounded="xl"
                    />
                  </Field.Root>
                </Grid>

                <Field.Root required>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your property — what makes it special?"
                    rows={5}
                    rounded="xl"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Photos</Field.Label>
                  <FileUpload.Root
                    maxFiles={10}
                    maxFileSize={1 * 1024 * 1024} // 1MB
                    accept={[
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ]}
                    onFileAccept={(details) => {
                      setUploadedFiles(details.files);
                    }}
                    onFileReject={(details) => {
                      details.files.forEach((fileRejection) => {
                        const fileName = fileRejection.file.name;
                        const errorMessages = fileRejection.errors.map(
                          (error) => {
                            // Convert error to readable message
                            if (typeof error === "string") return error;
                            return String(error);
                          },
                        );

                        toaster.create({
                          title: "File validation error",
                          description: `${fileName}: ${errorMessages.join(", ")}`,
                          type: "error",
                          duration: 5000,
                          closable: true,
                        });
                      });
                    }}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.Dropzone
                      border="2px dashed"
                      borderColor="gray.200"
                      rounded="xl"
                      p={8}
                      textAlign="center"
                      cursor="pointer"
                      bg="gray.50"
                      _hover={{ borderColor: "orange.300", bg: "orange.50" }}
                      w="full"
                      transition="all 0.2s"
                    >
                      <Icon fontSize="xl" color="gray.400" mb={2}>
                        <LuUpload />
                      </Icon>
                      <FileUpload.DropzoneContent>
                        <Text fontSize="sm" color="gray.500">
                          Drag & drop photos here, or click to browse
                        </Text>
                        <Text fontSize="xs" color="gray.400" mt={1}>
                          Up to 10 photos · JPG, PNG, WebP · Max 1MB each
                        </Text>
                      </FileUpload.DropzoneContent>
                    </FileUpload.Dropzone>

                    <FileUpload.Context>
                      {({ acceptedFiles }) =>
                        acceptedFiles.length > 0 && (
                          <Box mt={4}>
                            <Text fontSize="sm" color="gray.600" mb={3}>
                              {acceptedFiles.length} photo
                              {acceptedFiles.length > 1 ? "s" : ""} selected
                            </Text>
                            <FileUpload.ItemGroup>
                              <Grid
                                templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                                gap={3}
                                maxH="300px"
                                overflowY="auto"
                              >
                                {acceptedFiles.map((file) => (
                                  <FileUpload.Item
                                    key={file.name}
                                    file={file}
                                    position="relative"
                                    border="1px"
                                    borderColor="gray.200"
                                    rounded="lg"
                                    p={2}
                                    bg="white"
                                  >
                                    <Box
                                      bg="gray.100"
                                      rounded="md"
                                      p={2}
                                      textAlign="center"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      position="relative"
                                    >
                                      <FileUpload.ItemPreviewImage
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: "4px",
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      />
                                      <FileUpload.ItemDeleteTrigger asChild>
                                        <Button
                                          size="sm"
                                          position="absolute"
                                          top={-1}
                                          right={-1}
                                          bg="red.500"
                                          color="white"
                                          rounded="full"
                                          w={6}
                                          h={6}
                                          minWidth="unset"
                                          p={0}
                                          fontSize="xs"
                                          _hover={{ bg: "red.600" }}
                                        >
                                          <LuX />
                                        </Button>
                                      </FileUpload.ItemDeleteTrigger>
                                    </Box>
                                    <FileUpload.ItemName
                                      fontSize="xs"
                                      color="gray.500"
                                      mt={1}
                                      textAlign="center"
                                    />
                                    <FileUpload.ItemSizeText
                                      fontSize="xs"
                                      color="gray.400"
                                      textAlign="center"
                                    />
                                  </FileUpload.Item>
                                ))}
                              </Grid>
                            </FileUpload.ItemGroup>
                          </Box>
                        )
                      }
                    </FileUpload.Context>
                  </FileUpload.Root>
                </Field.Root>

                <Separator />
                <Box>
                  <Heading
                    as="h3"
                    fontFamily="DM Serif Display"
                    fontWeight="thin"
                    fontSize="xl"
                    mb={4}
                  >
                    Your Contact Info
                  </Heading>
                  <Field.Root required>
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                      id="phone"
                      value={formData.seller_phone}
                      onChange={(e) =>
                        handleInputChange("seller_phone", e.target.value)
                      }
                      placeholder="0912345678"
                      type="tel"
                      rounded="xl"
                    />
                  </Field.Root>
                </Box>

                <Flex gap={4}>
                  <Button
                    type="submit"
                    colorScheme="gray"
                    size="lg"
                    borderRadius="xl"
                    disabled={isSubmitting}
                    flex={1}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" mr={2} />
                        {isEditMode ? "Updating..." : "Submitting..."}
                      </>
                    ) : isEditMode ? (
                      "Update Listing"
                    ) : (
                      "Submit Listing"
                    )}
                  </Button>
                  {isEditMode && (
                    <Button
                      colorPalette="red"
                      size="lg"
                      borderRadius="xl"
                      onClick={() => router.push(`/property/${editId}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </Flex>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
