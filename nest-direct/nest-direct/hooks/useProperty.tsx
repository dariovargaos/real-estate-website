import { useQuery } from "@tanstack/react-query";
import { fetchProperty, propertyKeys } from "../lib/api";

// Hook for fetching a single property by ID using TanStack Query
export function useProperty(propertyId: string | undefined) {
  return useQuery({
    queryKey: propertyKeys.detail(propertyId || ""),
    queryFn: () => {
      if (!propertyId) {
        throw new Error("Property ID is required");
      }
      return fetchProperty(propertyId);
    },
    enabled: !!propertyId, // Only run query if propertyId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on "not found" errors
      if (error.message === "Property not found") {
        return false;
      }
      return failureCount < 2;
    },
  });
}