import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Property } from "../lib/database.types";

// Hook for fetching a single property by ID
export function useProperty(propertyId: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .eq("status", "active") // Only fetch active listings
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (err: any) {
      setError(err.message);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
}