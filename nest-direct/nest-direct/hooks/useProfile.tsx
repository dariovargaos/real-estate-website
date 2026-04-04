"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./useAuthContext";
import {
  fetchUserProfile,
  fetchPublicUserProperties,
  updateUserProfile,
  scheduleAccountDeletion,
  cancelAccountDeletion,
  fetchUserMessages,
  fetchConversation,
  markMessageAsRead,
  sendMessageReply,
  deleteMessage,
  deleteConversation,
  fetchUserProperties,
  fetchUserFavorites,
  addToFavorites,
  removeFromFavorites,
  userKeys,
} from "../lib/api";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/database.types";

// Hook for fetching any seller's public profile by their user ID
export function useSellerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.profile(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("No user ID");
      return fetchUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

// Hook for fetching any seller's active property listings by their user ID
export function useSellerProperties(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", "public-properties", userId || ""],
    queryFn: () => {
      if (!userId) throw new Error("No user ID");
      return fetchPublicUserProperties(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook for user profile data
export function useUserProfile() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: userKeys.profile(user?.id || ""),
    queryFn: () => {
      if (!user?.id) throw new Error("No user ID");
      return fetchUserProfile(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error("No user ID");
      return updateUserProfile(user.id, updates);
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({
        queryKey: userKeys.profile(user?.id || ""),
      });
    },
  });

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      await updateProfileMutation.mutateAsync(updates);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const scheduleDeleteAccount = async () => {
    if (!user?.id) return { success: false, error: "No user ID" };
    try {
      await scheduleAccountDeletion(user.id);
      queryClient.invalidateQueries({ queryKey: userKeys.profile(user.id) });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const cancelDeleteAccount = async () => {
    if (!user?.id) return { success: false, error: "No user ID" };
    try {
      await cancelAccountDeletion(user.id);
      queryClient.invalidateQueries({ queryKey: userKeys.profile(user.id) });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    profile: profileQuery.data || null,
    loading: profileQuery.isLoading,
    error: profileQuery.error?.message || null,
    updateProfile,
    scheduleDeleteAccount,
    cancelDeleteAccount,
    refetch: profileQuery.refetch,
  };
}

// Hook for user messages (inbox)
export function useUserMessages() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Subscribe to message changes for this user — invalidates both inbox and
  // any open conversation the moment a new message is inserted/updated/deleted.
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({
            queryKey: userKeys.messages(user.id),
          });
          queryClient.invalidateQueries({ queryKey: ["conversation"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const messagesQuery = useQuery({
    queryKey: userKeys.messages(user?.id || ""),
    queryFn: () => {
      if (!user?.id) throw new Error("No user ID");
      return fetchUserMessages(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 5, // fallback poll every 5 minutes (Realtime handles live updates)
  });

  // Hook for conversation messages
  const useConversation = (otherUserId?: string, propertyId?: string) => {
    return useQuery({
      queryKey: ["conversation", user?.id, otherUserId, propertyId],
      queryFn: () => {
        if (!user?.id || !otherUserId || !propertyId)
          throw new Error("Missing required data");
        return fetchConversation(user.id, otherUserId, propertyId);
      },
      enabled: !!(user?.id && otherUserId && propertyId),
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5, // fallback poll every 5 minutes (Realtime handles live updates)
    });
  };

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
    onSuccess: () => {
      // Invalidate messages to refetch updated data
      queryClient.invalidateQueries({
        queryKey: userKeys.messages(user?.id || ""),
      });
      // Also invalidate conversation queries
      queryClient.invalidateQueries({
        queryKey: ["conversation"],
      });
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => sendMessageReply(messageId, content),
    onSuccess: () => {
      // Invalidate messages to refetch updated data
      queryClient.invalidateQueries({
        queryKey: userKeys.messages(user?.id || ""),
      });
      // Also invalidate conversation queries
      queryClient.invalidateQueries({
        queryKey: ["conversation"],
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: ({
      messageId,
      userId,
    }: {
      messageId: string;
      userId: string;
    }) => deleteMessage(messageId, userId),
    onSuccess: () => {
      // Invalidate messages to refetch updated data
      queryClient.invalidateQueries({
        queryKey: userKeys.messages(user?.id || ""),
      });
      // Also invalidate conversation queries
      queryClient.invalidateQueries({
        queryKey: ["conversation"],
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: ({
      userId,
      otherUserId,
      propertyId,
    }: {
      userId: string;
      otherUserId: string;
      propertyId: string;
    }) => deleteConversation(userId, otherUserId, propertyId),
    onSuccess: () => {
      // Invalidate messages to refetch updated data
      queryClient.invalidateQueries({
        queryKey: userKeys.messages(user?.id || ""),
      });
      // Also invalidate conversation queries
      queryClient.invalidateQueries({
        queryKey: ["conversation"],
      });
    },
  });

  const markAsRead = async (messageId: string) => {
    try {
      await markAsReadMutation.mutateAsync(messageId);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const sendReply = async (messageId: string, content: string) => {
    try {
      await sendReplyMutation.mutateAsync({ messageId, content });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const deleteUserMessage = async (messageId: string) => {
    try {
      if (!user?.id) throw new Error("User ID is required");
      await deleteMessageMutation.mutateAsync({ messageId, userId: user.id });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const deleteUserConversation = async (
    otherUserId: string,
    propertyId: string,
  ) => {
    try {
      if (!user?.id) throw new Error("User ID is required");
      await deleteConversationMutation.mutateAsync({
        userId: user.id,
        otherUserId,
        propertyId,
      });
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    messages: messagesQuery.data || [],
    loading: messagesQuery.isLoading,
    error: messagesQuery.error?.message || null,
    refetch: messagesQuery.refetch,
    markAsRead,
    sendReply,
    deleteMessage: deleteUserMessage,
    deleteConversation: deleteUserConversation,
    useConversation,
  };
}

// Hook for user's property listings
export function useUserProperties() {
  const { user } = useUser();

  const propertiesQuery = useQuery({
    queryKey: userKeys.properties(user?.id || ""),
    queryFn: () => {
      if (!user?.id) throw new Error("No user ID");
      return fetchUserProperties(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });

  return {
    properties: propertiesQuery.data || [],
    loading: propertiesQuery.isLoading,
    error: propertiesQuery.error?.message || null,
    refetch: propertiesQuery.refetch,
  };
}

// Hook for user favorites
export function useUserFavorites() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: userKeys.favorites(user?.id || ""),
    queryFn: () => {
      if (!user?.id) throw new Error("No user ID");
      return fetchUserFavorites(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: (propertyId: string) => {
      if (!user?.id) throw new Error("No user ID");
      return addToFavorites(user.id, propertyId, user.email);
    },
    onSuccess: () => {
      // Invalidate favorites list to refetch
      queryClient.invalidateQueries({
        queryKey: userKeys.favorites(user?.id || ""),
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (propertyId: string) => {
      if (!user?.id) throw new Error("No user ID");
      return removeFromFavorites(user.id, propertyId);
    },
    onSuccess: () => {
      // Invalidate favorites list to refetch
      queryClient.invalidateQueries({
        queryKey: userKeys.favorites(user?.id || ""),
      });
    },
  });

  const addToFavoritesHandler = async (propertyId: string) => {
    try {
      await addToFavoritesMutation.mutateAsync(propertyId);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const removeFromFavoritesHandler = async (propertyId: string) => {
    try {
      await removeFromFavoritesMutation.mutateAsync(propertyId);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    favorites: favoritesQuery.data || [],
    loading: favoritesQuery.isLoading,
    error: favoritesQuery.error?.message || null,
    addToFavorites: addToFavoritesHandler,
    removeFromFavorites: removeFromFavoritesHandler,
    refetch: favoritesQuery.refetch,
  };
}
