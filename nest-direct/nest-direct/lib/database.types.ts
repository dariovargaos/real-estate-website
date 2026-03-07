export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          is_read: boolean | null;
          property_id: string | null;
          recipient_id: string | null;
          recipient_name: string;
          sender_email: string | null;
          sender_id: string | null;
          sender_name: string;
          sender_phone: string | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          property_id?: string | null;
          recipient_id?: string | null;
          recipient_name: string;
          sender_email?: string | null;
          sender_id?: string | null;
          sender_name: string;
          sender_phone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          property_id?: string | null;
          recipient_id?: string | null;
          recipient_name?: string;
          sender_email?: string | null;
          sender_id?: string | null;
          sender_name?: string;
          sender_phone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          is_verified: boolean | null;
          last_name: string | null;
          marketing_emails_enabled: boolean | null;
          phone: string | null;
          preferred_contact_method: string | null;
          state: string | null;
          street_address: string | null;
          updated_at: string;
          user_type: string | null;
          verification_document_url: string | null;
          zip_code: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          is_verified?: boolean | null;
          last_name?: string | null;
          marketing_emails_enabled?: boolean | null;
          phone?: string | null;
          preferred_contact_method?: string | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string;
          user_type?: string | null;
          verification_document_url?: string | null;
          zip_code?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          last_name?: string | null;
          marketing_emails_enabled?: boolean | null;
          phone?: string | null;
          preferred_contact_method?: string | null;
          state?: string | null;
          street_address?: string | null;
          updated_at?: string;
          user_type?: string | null;
          verification_document_url?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          baths: number;
          beds: number;
          created_at: string | null;
          description: string;
          features: string[];
          id: string;
          image: string;
          images: string[];
          location: string;
          price: string;
          seller_name: string;
          seller_phone: string;
          seller_since: string;
          sqft: string;
          status: string | null;
          tag: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          baths: number;
          beds: number;
          created_at?: string | null;
          description: string;
          features?: string[];
          id?: string;
          image: string;
          images?: string[];
          location: string;
          price: string;
          seller_name: string;
          seller_phone: string;
          seller_since: string;
          sqft: string;
          status?: string | null;
          tag?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          baths?: number;
          beds?: number;
          created_at?: string | null;
          description?: string;
          features?: string[];
          id?: string;
          image?: string;
          images?: string[];
          location?: string;
          price?: string;
          seller_name?: string;
          seller_phone?: string;
          seller_since?: string;
          sqft?: string;
          status?: string | null;
          tag?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      property_views: {
        Row: {
          device_type: string | null;
          id: string;
          is_return_visitor: boolean | null;
          page_source: string | null;
          property_id: string;
          referrer: string | null;
          session_id: string | null;
          user_agent: string | null;
          view_duration: number | null;
          viewed_at: string | null;
          viewer_id: string | null;
          viewer_ip: string | null; // INET type as string
        };
        Insert: {
          device_type?: string | null;
          id?: string;
          is_return_visitor?: boolean | null;
          page_source?: string | null;
          property_id: string;
          referrer?: string | null;
          session_id?: string | null;
          user_agent?: string | null;
          view_duration?: number | null;
          viewed_at?: string | null;
          viewer_id?: string | null;
          viewer_ip?: string | null;
        };
        Update: {
          device_type?: string | null;
          id?: string;
          is_return_visitor?: boolean | null;
          page_source?: string | null;
          property_id?: string;
          referrer?: string | null;
          session_id?: string | null;
          user_agent?: string | null;
          view_duration?: number | null;
          viewed_at?: string | null;
          viewer_id?: string | null;
          viewer_ip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      user_favorites: {
        Row: {
          created_at: string | null;
          id: string;
          property_id: string | null;
          user_email: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          property_id?: string | null;
          user_email?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          property_id?: string | null;
          user_email?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorites_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Type helpers for easier usage
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert =
  Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate =
  Database["public"]["Tables"]["properties"]["Update"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type UserFavorite =
  Database["public"]["Tables"]["user_favorites"]["Row"];
export type UserFavoriteInsert =
  Database["public"]["Tables"]["user_favorites"]["Insert"];
export type UserFavoriteUpdate =
  Database["public"]["Tables"]["user_favorites"]["Update"];

export type PropertyView =
  Database["public"]["Tables"]["property_views"]["Row"];
export type PropertyViewInsert =
  Database["public"]["Tables"]["property_views"]["Insert"];
export type PropertyViewUpdate =
  Database["public"]["Tables"]["property_views"]["Update"];
