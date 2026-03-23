import { supabase } from "./supabase";
import type {
  Property,
  Profile,
  Message,
  UserFavorite,
} from "./database.types";

// API function to clean up old "New" tags (removes "New" tag from properties older than 7 days)
// Uses a SECURITY DEFINER RPC function to bypass RLS, which would otherwise restrict
// updates to only the current user's own properties.
export async function cleanupOldNewTags(): Promise<void> {
  const { error } = await supabase.rpc("cleanup_old_new_tags");

  if (error) {
    console.error("Error cleaning up old New tags:", error.message);
    // Don't throw error - this should fail silently to not break the UI
  }
}

// API function to fetch all active properties
export async function fetchProperties(): Promise<Property[]> {
  // Clean up old "New" tags before fetching properties
  await cleanupOldNewTags();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// API function to fetch a single property by ID
export async function fetchProperty(propertyId: string): Promise<Property> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("status", "active")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Property not found");
  }

  return data;
}

// API function to fetch user profile
export async function fetchUserProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Profile not found");
  }

  return data;
}

// API function to update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<Profile>,
) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

// API function to fetch user messages
export async function fetchUserMessages(
  userId: string,
): Promise<(Message & { property: Property | null })[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      property:properties(*)
    `,
    )
    .eq("recipient_id", userId)
    .not("deleted_by", "cs", `{${userId}}`)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// API function to fetch conversation between two users about a property
export async function fetchConversation(
  userId: string,
  otherUserId: string,
  propertyId: string,
): Promise<(Message & { property: Property | null })[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      property:properties(*)
    `,
    )
    .eq("property_id", propertyId)
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .not("deleted_by", "cs", `{${userId}}`)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// API function to mark message as read
export async function markMessageAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }
}

// API function to delete a message (soft delete)
export async function deleteMessage(
  messageId: string,
  userId: string,
): Promise<void> {
  // First get the current deleted_by array
  const { data: currentMessage, error: fetchError } = await supabase
    .from("messages")
    .select("deleted_by")
    .eq("id", messageId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Add current user to deleted_by array if not already present
  const currentDeletedBy = currentMessage.deleted_by || [];
  const updatedDeletedBy = currentDeletedBy.includes(userId)
    ? currentDeletedBy
    : [...currentDeletedBy, userId];

  const { error } = await supabase
    .from("messages")
    .update({ deleted_by: updatedDeletedBy })
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }
}

// API function to delete entire conversation (soft delete all messages)
export async function deleteConversation(
  userId: string,
  otherUserId: string,
  propertyId: string,
): Promise<void> {
  // Get all messages in the conversation
  const { data: messages, error: fetchError } = await supabase
    .from("messages")
    .select("id, deleted_by")
    .eq("property_id", propertyId)
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    );

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!messages || messages.length === 0) {
    return; // No messages to delete
  }

  // Update each message to include the user in deleted_by array
  const updatePromises = messages.map(async (message) => {
    const currentDeletedBy = message.deleted_by || [];
    const updatedDeletedBy = currentDeletedBy.includes(userId)
      ? currentDeletedBy
      : [...currentDeletedBy, userId];

    return supabase
      .from("messages")
      .update({ deleted_by: updatedDeletedBy })
      .eq("id", message.id);
  });

  // Execute all updates in parallel
  const results = await Promise.all(updatePromises);

  // Check for any errors
  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(`Failed to update ${errors.length} messages`);
  }
}

// API function to send reply to message
export async function sendMessageReply(
  originalMessageId: string,
  replyContent: string,
): Promise<void> {
  // First, get the original message to get sender info
  const { data: originalMessage, error: fetchError } = await supabase
    .from("messages")
    .select("sender_id, sender_name, sender_email, property_id, recipient_id")
    .eq("id", originalMessageId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!originalMessage) {
    throw new Error("Original message not found");
  }

  // Check if we have valid sender and recipient IDs
  if (!originalMessage.sender_id || !originalMessage.recipient_id) {
    throw new Error("Invalid message data: missing sender or recipient ID");
  }

  // Get the recipient's name (original sender) from profiles
  const { data: recipientProfile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", originalMessage.sender_id)
    .single();

  if (profileError) {
    throw new Error("Could not find recipient profile");
  }

  // Get the sender's name (current user replying) from profiles
  const { data: senderProfile, error: senderError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", originalMessage.recipient_id)
    .single();

  if (senderError) {
    throw new Error("Could not find sender profile");
  }

  // Format names
  const recipientName =
    recipientProfile.first_name && recipientProfile.last_name
      ? `${recipientProfile.first_name} ${recipientProfile.last_name}`
      : recipientProfile.first_name || "Unknown User";

  const senderName =
    senderProfile.first_name && senderProfile.last_name
      ? `${senderProfile.first_name} ${senderProfile.last_name}`
      : senderProfile.first_name || "Unknown User";

  // Create reply message (swap sender and recipient)
  const { error } = await supabase.from("messages").insert({
    content: replyContent,
    sender_id: originalMessage.recipient_id,
    recipient_id: originalMessage.sender_id,
    sender_name: senderName,
    recipient_name: recipientName,
    sender_email: null, // Will be populated by backend if needed
    property_id: originalMessage.property_id,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

// API function to fetch user properties
export async function fetchUserProperties(userId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// API function to fetch user favorites
export async function fetchUserFavorites(
  userId: string,
): Promise<(UserFavorite & { property: Property })[]> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(
      `
      *,
      property:properties(*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.filter(
      (fav): fav is UserFavorite & { property: Property } =>
        fav.property !== null,
    ) || []
  );
}

// API function to add to favorites
export async function addToFavorites(
  userId: string,
  propertyId: string,
  userEmail?: string,
) {
  const { error } = await supabase.from("user_favorites").insert({
    user_id: userId,
    property_id: propertyId,
    user_email: userEmail,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// API function to remove from favorites
export async function removeFromFavorites(userId: string, propertyId: string) {
  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("property_id", propertyId);

  if (error) {
    throw new Error(error.message);
  }
}

// API function to send a new message to property owner
export async function sendContactMessage(messageData: {
  propertyId: string;
  senderName: string; // Will be overridden with data from profile
  senderEmail: string; // Not used anymore
  content: string;
  senderId: string; // Required - only authenticated users can send messages
}): Promise<void> {
  // Verify user is authenticated
  if (!messageData.senderId) {
    throw new Error("You must be signed in to send messages");
  }

  // Get sender profile info
  const { data: senderProfile, error: senderError } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", messageData.senderId)
    .single();

  if (senderError) {
    throw new Error("Could not find your profile information");
  }

  // Format sender name from profile
  const senderName =
    senderProfile?.first_name && senderProfile?.last_name
      ? `${senderProfile.first_name} ${senderProfile.last_name}`
      : senderProfile?.first_name || "Unknown User";

  const senderEmail = senderProfile?.email || "";

  // Get property info
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, title, user_id")
    .eq("id", messageData.propertyId)
    .eq("status", "active")
    .single();

  if (propertyError) {
    console.error("Property lookup error:", propertyError);
    throw new Error("Property not found");
  }

  if (!property) {
    throw new Error("Property not found");
  }

  // Check if property has an owner
  if (!property.user_id) {
    throw new Error(
      "This property does not have an assigned owner and cannot receive messages",
    );
  }

  // Prevent messaging yourself
  if (property.user_id === messageData.senderId) {
    throw new Error("You cannot send messages to your own properties");
  }

  // Get owner profile info
  let recipientName = "Property Owner";
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", property.user_id)
    .single();

  if (ownerProfile) {
    const { first_name, last_name } = ownerProfile;
    recipientName =
      first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || "Property Owner";
  }

  // Insert the message
  const { error } = await supabase.from("messages").insert({
    content: messageData.content,
    sender_id: messageData.senderId,
    recipient_id: property.user_id,
    sender_name: senderName, // Use name from profile
    recipient_name: recipientName,
    sender_email: senderEmail, // Use email from profile
    property_id: messageData.propertyId,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Message insert error:", error);
    throw new Error("Failed to send message. Please try again.");
  }
}

// API function to upload images to Supabase Storage
export async function uploadPropertyImages(
  files: File[],
  userId: string,
): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 11);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${timestamp}_${index}_${randomId}.${fileExt}`;

    // Upload file to property-images bucket
    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload one or more images");
  }
}

// API function to create a new property listing
export async function createProperty(propertyData: {
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  size_m2: string;
  description: string;
  seller_name: string;
  seller_phone: string;
  user_id: string;
  property_type?: string;
  imageFiles?: File[]; // Add image files to the interface
}): Promise<Property> {
  // Upload images if provided
  let imageUrls: string[] = ["/placeholder.jpg"];
  let mainImage = "/placeholder.jpg";

  if (propertyData.imageFiles && propertyData.imageFiles.length > 0) {
    try {
      imageUrls = await uploadPropertyImages(
        propertyData.imageFiles,
        propertyData.user_id,
      );
      mainImage = imageUrls[0]; // First image becomes the main image
    } catch (error) {
      console.error("Error uploading images:", error);
      // Continue with default images if upload fails
    }
  }

  // Get user profile for seller_since date
  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("id", propertyData.user_id)
    .single();

  // Format as currency for display
  const formattedPrice = `€${parseInt(propertyData.price).toLocaleString()}`;

  // Debug: Log user ID
  console.log("Creating property for user ID:", propertyData.user_id);

  // Prepare features array
  const features = [];
  if (propertyData.property_type) {
    features.push(propertyData.property_type);
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      title: propertyData.title,
      price: formattedPrice,
      location: propertyData.location,
      beds: propertyData.beds,
      baths: propertyData.baths,
      size_m2: propertyData.size_m2,
      description: propertyData.description,
      seller_name: propertyData.seller_name,
      seller_phone: propertyData.seller_phone,
      user_id: propertyData.user_id,
      seller_since: profile?.created_at || new Date().toISOString(),
      image: mainImage, // Use uploaded image or placeholder
      images: imageUrls, // Use uploaded images or placeholder
      features,
      type: propertyData.property_type, // Store property_type in type column
      tag: "New", // Mark new properties with "New" tag
      status: "pending", // Properties start as pending for review
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create property");
  }

  return data;
}

// API function to update an existing property listing
export async function updateProperty(
  propertyId: string,
  propertyData: {
    title: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    size_m2: string;
    description: string;
    seller_name: string;
    seller_phone: string;
    property_type?: string;
    imageFiles?: File[];
    keepImageUrls?: string[]; // existing image URLs to retain after user deletions
  },
  userId: string,
): Promise<Property> {
  // First, verify the user owns this property
  const { data: existingProperty, error: fetchError } = await supabase
    .from("properties")
    .select("user_id, images")
    .eq("id", propertyId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  if (existingProperty.user_id !== userId) {
    throw new Error("Unauthorized: You can only update your own properties");
  }

  // Use keepImageUrls if provided (user may have deleted some), otherwise fall back to all existing
  let imageUrls: string[] = propertyData.keepImageUrls ??
    existingProperty.images ?? ["/placeholder.jpg"];
  let mainImage = imageUrls[0] || "/placeholder.jpg";

  if (propertyData.imageFiles && propertyData.imageFiles.length > 0) {
    try {
      const newImageUrls = await uploadPropertyImages(
        propertyData.imageFiles,
        userId,
      );
      // Append newly uploaded images after the retained existing ones
      imageUrls = [...imageUrls, ...newImageUrls];
      mainImage = imageUrls[0];
    } catch (error) {
      console.error("Error uploading new images:", error);
      // Continue with existing images if upload fails
    }
  }

  // Fall back to placeholder if no images remain
  if (imageUrls.length === 0) {
    imageUrls = ["/placeholder.jpg"];
    mainImage = "/placeholder.jpg";
  }

  // Format as currency for display
  const formattedPrice = `€${parseInt(propertyData.price).toLocaleString()}`;

  // Prepare features array
  const features = [];
  if (propertyData.property_type) {
    features.push(propertyData.property_type);
  }

  // Update the property
  const { data, error } = await supabase
    .from("properties")
    .update({
      title: propertyData.title,
      price: formattedPrice,
      location: propertyData.location,
      beds: propertyData.beds,
      baths: propertyData.baths,
      size_m2: propertyData.size_m2,
      description: propertyData.description,
      seller_name: propertyData.seller_name,
      seller_phone: propertyData.seller_phone,
      image: mainImage,
      images: imageUrls,
      features,
      type: propertyData.property_type, // Store property_type in type column
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .eq("user_id", userId) // Double-check user ownership
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update property");
  }

  return data;
}

// API function to fetch only Premium and Elite properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .in("tag", ["Premium", "Elite"])
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Query keys for consistent cache management
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: string) => [...propertyKeys.lists(), { filters }] as const,
  featured: () => [...propertyKeys.all, "featured"] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

export const userKeys = {
  all: ["user"] as const,
  profile: (userId: string) => [...userKeys.all, "profile", userId] as const,
  messages: (userId: string) => [...userKeys.all, "messages", userId] as const,
  properties: (userId: string) =>
    [...userKeys.all, "properties", userId] as const,
  favorites: (userId: string) =>
    [...userKeys.all, "favorites", userId] as const,
};
