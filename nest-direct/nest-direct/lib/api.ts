import { supabase } from "./supabase";
import type {
  Property,
  Profile,
  Message,
  UserFavorite,
} from "./database.types";

// API function to fetch all active properties
export async function fetchProperties(): Promise<Property[]> {
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
    .order("created_at", { ascending: false });

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

// Query keys for consistent cache management
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: string) => [...propertyKeys.lists(), { filters }] as const,
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
