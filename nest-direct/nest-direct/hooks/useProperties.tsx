import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProperties,
  fetchFeaturedProperties,
  propertyKeys,
} from "../lib/api";
import { supabase } from "../lib/supabase";

// Hook for fetching listed properties (public listings) using TanStack Query
export function useListedProperties() {
  const queryClient = useQueryClient();

  // Subscribe to any change on the properties table and immediately invalidate
  // the cache so the UI reflects the new state (e.g. pending → active).
  useEffect(() => {
    const channel = supabase
      .channel("properties-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => {
          queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
          queryClient.invalidateQueries({ queryKey: propertyKeys.featured() });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 3, // 3 minutes stale time for property lists
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
    refetchInterval: 1000 * 60 * 10, // fallback poll every 10 minutes (Realtime handles live updates)
    refetchOnWindowFocus: false,
  });
}

// Hook for fetching only Premium and Elite properties for the featured section
export function useFeaturedProperties() {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: fetchFeaturedProperties,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes before considering stale
    gcTime: 1000 * 60 * 30, // keep in memory for 30 minutes
    refetchInterval: 1000 * 60 * 10, // fallback poll every 10 minutes
    refetchOnWindowFocus: false,
  });
}
