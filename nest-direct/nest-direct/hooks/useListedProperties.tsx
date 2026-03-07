import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Property } from "../lib/database.types";

// Hook for fetching listed properties (public listings)
export function useListedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListedProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active") // Only fetch active listings
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
    fetchListedProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: fetchListedProperties,
  };
}
