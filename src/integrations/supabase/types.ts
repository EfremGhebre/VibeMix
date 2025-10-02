export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      albums: {
        Row: {
          artist_id: string
          cover_image_url: string | null
          created_at: string
          id: string
          release_date: string | null
          title: string
          total_tracks: number | null
        }
        Insert: {
          artist_id: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          title: string
          total_tracks?: number | null
        }
        Update: {
          artist_id?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
          title?: string
          total_tracks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          monthly_listeners: number | null
          name: string
          verified: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          monthly_listeners?: number | null
          name: string
          verified?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          monthly_listeners?: number | null
          name?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      listening_history: {
        Row: {
          completed: boolean | null
          duration_played_ms: number | null
          id: string
          played_at: string
          song_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          duration_played_ms?: number | null
          id?: string
          played_at?: string
          song_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          duration_played_ms?: number | null
          id?: string
          played_at?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listening_history_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      playlist_songs: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          position: number
          song_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          position: number
          song_id: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          position?: number
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      song_genres: {
        Row: {
          genre_id: string
          id: string
          song_id: string
        }
        Insert: {
          genre_id: string
          id?: string
          song_id: string
        }
        Update: {
          genre_id?: string
          id?: string
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_genres_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      song_moods: {
        Row: {
          id: string
          mood_id: string
          song_id: string
        }
        Insert: {
          id?: string
          mood_id: string
          song_id: string
        }
        Update: {
          id?: string
          mood_id?: string
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_moods_mood_id_fkey"
            columns: ["mood_id"]
            isOneToOne: false
            referencedRelation: "mood_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_moods_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album_id: string | null
          artist_id: string
          audio_url: string | null
          created_at: string
          duration_ms: number
          explicit: boolean | null
          id: string
          language: string | null
          lyrics: string | null
          popularity: number | null
          preview_url: string | null
          release_date: string | null
          title: string
        }
        Insert: {
          album_id?: string | null
          artist_id: string
          audio_url?: string | null
          created_at?: string
          duration_ms: number
          explicit?: boolean | null
          id?: string
          language?: string | null
          lyrics?: string | null
          popularity?: number | null
          preview_url?: string | null
          release_date?: string | null
          title: string
        }
        Update: {
          album_id?: string | null
          artist_id?: string
          audio_url?: string | null
          created_at?: string
          duration_ms?: number
          explicit?: boolean | null
          id?: string
          language?: string | null
          lyrics?: string | null
          popularity?: number | null
          preview_url?: string | null
          release_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      spotify_token_audit_log: {
        Row: {
          action: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      spotify_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          audio_quality: string | null
          autoplay_enabled: boolean | null
          created_at: string
          explicit_content_allowed: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          spotify_display_name: string | null
          spotify_user_id: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_quality?: string | null
          autoplay_enabled?: boolean | null
          created_at?: string
          explicit_content_allowed?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          spotify_display_name?: string | null
          spotify_user_id?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_quality?: string | null
          autoplay_enabled?: boolean | null
          created_at?: string
          explicit_content_allowed?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          spotify_display_name?: string | null
          spotify_user_id?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_spotify_user_info: {
        Args: { user_id_param?: string }
        Returns: Json
      }
      has_spotify_connection: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
