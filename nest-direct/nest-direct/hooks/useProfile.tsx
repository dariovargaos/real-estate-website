"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./useAuthContext";
import type {
  Profile,
  Message,
  Property,
  UserFavorite,
} from "../lib/database.types";

// Hook for user profile data
export function useUserProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return { success: false, error: "No user found" };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

// Hook for user messages (inbox)
export function useUserMessages() {
  const { user } = useUser();
  const [messages, setMessages] = useState<
    (Message & { property: Property | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          property:properties(*)
        `,
        )
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg,
        ),
      );
    } catch (err: any) {
      console.error("Error marking message as read:", err.message);
    }
  };

  const sendReply = async (messageId: string, content: string) => {
    if (!user?.id) return { success: false, error: "No user found" };

    try {
      const originalMessage = messages.find((msg) => msg.id === messageId);
      if (!originalMessage) throw new Error("Original message not found");

      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: user.id,
        sender_name:
          `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
          user.email ||
          "Unknown",
        sender_email: user.email,
        recipient_id: originalMessage.sender_id,
        recipient_name: originalMessage.sender_name,
        property_id: originalMessage.property_id,
      });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id]);

  return {
    messages,
    loading,
    error,
    markAsRead,
    sendReply,
    refetch: fetchMessages,
  };
}

// Hook for user's property listings
export function useUserProperties() {
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Now using proper user_id column for filtering user's properties
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user?.id]);

  return { properties, loading, error, refetch: fetchProperties };
}

// Hook for user favorites
export function useUserFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<
    (UserFavorite & { property: Property })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_favorites")
        .select(
          `
          *,
          property:properties(*)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data?.filter((fav) => fav.property) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (propertyId: string) => {
    if (!user?.id) return { success: false, error: "No user found" };

    try {
      const { error } = await supabase.from("user_favorites").insert({
        user_id: user.id,
        property_id: propertyId,
        user_email: user.email,
      });

      if (error) throw error;
      await fetchFavorites(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    if (!user?.id) return { success: false, error: "No user found" };

    try {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      if (error) throw error;
      await fetchFavorites(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites,
  };
}
