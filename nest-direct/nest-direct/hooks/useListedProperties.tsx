import { useQuery } from "@tanstack/react-query";
import { fetchProperties, propertyKeys } from "../lib/api";

// Hook for fetching listed properties (public listings) using TanStack Query
export function useListedProperties() {
  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 3, // 3 minutes stale time for property lists
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
  });
}
