import { useQuery } from "@tanstack/react-query";
import {
  fetchProperties,
  fetchFeaturedProperties,
  propertyKeys,
} from "../lib/api";

// Hook for fetching listed properties (public listings) using TanStack Query
export function useListedProperties() {
  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 3, // 3 minutes stale time for property lists
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
    refetchOnWindowFocus: false, // don't re-hit DB just because user switched tabs
  });
}

// Hook for fetching only Premium and Elite properties for the featured section
export function useFeaturedProperties() {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: fetchFeaturedProperties,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes before considering stale
    gcTime: 1000 * 60 * 30, // keep in memory for 30 minutes
    refetchOnWindowFocus: false, // don't re-hit DB just because user switched tabs
  });
}
