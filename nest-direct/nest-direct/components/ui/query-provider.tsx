"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create QueryClient inside client component to avoid serialization issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time of 5 minutes for property data
            staleTime: 1000 * 60 * 5,
            // Cache time of 10 minutes
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 2 times
            retry: 2,
            // Don't refetch on window/tab focus to avoid unnecessary requests
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
