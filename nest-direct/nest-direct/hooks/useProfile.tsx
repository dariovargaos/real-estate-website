"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./useAuthContext";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserMessages,
  fetchUserProperties,
  fetchUserFavorites,
  addToFavorites,
  removeFromFavorites,
  userKeys,
} from "../lib/api";
import type { Profile } from "../lib/database.types";

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
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    profile: profileQuery.data || null,
    loading: profileQuery.isLoading,
    error: profileQuery.error?.message || null,
    updateProfile,
    refetch: profileQuery.refetch,
  };
}

// Hook for user messages (inbox)
export function useUserMessages() {
  const { user } = useUser();

  const messagesQuery = useQuery({
    queryKey: userKeys.messages(user?.id || ""),
    queryFn: () => {
      if (!user?.id) throw new Error("No user ID");
      return fetchUserMessages(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 1, // Refetch every minute for new messages
  });

  // Note: markAsRead and sendReply functions would need separate API endpoints
  // For now, keeping them as they were but they should also be converted to mutations

  return {
    messages: messagesQuery.data || [],
    loading: messagesQuery.isLoading,
    error: messagesQuery.error?.message || null,
    refetch: messagesQuery.refetch,
    // TODO: Convert markAsRead and sendReply to useMutation
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
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeFromFavoritesHandler = async (propertyId: string) => {
    try {
      await removeFromFavoritesMutation.mutateAsync(propertyId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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
