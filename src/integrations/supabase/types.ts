export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      directors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string
          episode_number: number
          id: string
          overview: string
          player_url: string
          poster: string
          runtime: string
          season_id: string
          title: string
        }
        Insert: {
          created_at?: string
          episode_number: number
          id?: string
          overview: string
          player_url: string
          poster: string
          runtime: string
          season_id: string
          title: string
        }
        Update: {
          created_at?: string
          episode_number?: number
          id?: string
          overview?: string
          player_url?: string
          poster?: string
          runtime?: string
          season_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      media_uploads: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          status: string | null
          updated_at: string | null
          upload_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          status?: string | null
          updated_at?: string | null
          upload_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          upload_type?: string
          user_id?: string
        }
        Relationships: []
      }
      movie_actors: {
        Row: {
          actor_id: string
          movie_id: string
        }
        Insert: {
          actor_id: string
          movie_id: string
        }
        Update: {
          actor_id?: string
          movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_actors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_actors_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_categories: {
        Row: {
          category_id: string
          movie_id: string
        }
        Insert: {
          category_id: string
          movie_id: string
        }
        Update: {
          category_id?: string
          movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_categories_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_directors: {
        Row: {
          director_id: string
          movie_id: string
        }
        Insert: {
          director_id: string
          movie_id: string
        }
        Update: {
          director_id?: string
          movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_directors_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "directors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_directors_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_producers: {
        Row: {
          movie_id: string
          producer_id: string
        }
        Insert: {
          movie_id: string
          producer_id: string
        }
        Update: {
          movie_id?: string
          producer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_producers_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_producers_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          backdrop: string
          created_at: string
          duration: string
          id: string
          original_title: string | null
          player_url: string
          plot: string
          poster: string
          quality: string
          rating: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          backdrop: string
          created_at?: string
          duration: string
          id?: string
          original_title?: string | null
          player_url: string
          plot: string
          poster: string
          quality: string
          rating: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          backdrop?: string
          created_at?: string
          duration?: string
          id?: string
          original_title?: string | null
          player_url?: string
          plot?: string
          poster?: string
          quality?: string
          rating?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      producers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      related_movies: {
        Row: {
          movie_id: string
          related_movie_id: string
        }
        Insert: {
          movie_id: string
          related_movie_id: string
        }
        Update: {
          movie_id?: string
          related_movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_movies_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_movies_related_movie_id_fkey"
            columns: ["related_movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      related_tvshows: {
        Row: {
          related_tvshow_id: string
          tvshow_id: string
        }
        Insert: {
          related_tvshow_id: string
          tvshow_id: string
        }
        Update: {
          related_tvshow_id?: string
          tvshow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_tvshows_related_tvshow_id_fkey"
            columns: ["related_tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_tvshows_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          episode_count: number
          id: string
          season_number: number
          tvshow_id: string
          year: string
        }
        Insert: {
          created_at?: string
          episode_count?: number
          id?: string
          season_number: number
          tvshow_id: string
          year: string
        }
        Update: {
          created_at?: string
          episode_count?: number
          id?: string
          season_number?: number
          tvshow_id?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      tvshow_actors: {
        Row: {
          actor_id: string
          tvshow_id: string
        }
        Insert: {
          actor_id: string
          tvshow_id: string
        }
        Update: {
          actor_id?: string
          tvshow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tvshow_actors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tvshow_actors_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      tvshow_categories: {
        Row: {
          category_id: string
          tvshow_id: string
        }
        Insert: {
          category_id: string
          tvshow_id: string
        }
        Update: {
          category_id?: string
          tvshow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tvshow_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tvshow_categories_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      tvshow_directors: {
        Row: {
          director_id: string
          tvshow_id: string
        }
        Insert: {
          director_id: string
          tvshow_id: string
        }
        Update: {
          director_id?: string
          tvshow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tvshow_directors_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "directors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tvshow_directors_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      tvshow_producers: {
        Row: {
          producer_id: string
          tvshow_id: string
        }
        Insert: {
          producer_id: string
          tvshow_id: string
        }
        Update: {
          producer_id?: string
          tvshow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tvshow_producers_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tvshow_producers_tvshow_id_fkey"
            columns: ["tvshow_id"]
            isOneToOne: false
            referencedRelation: "tvshows"
            referencedColumns: ["id"]
          },
        ]
      }
      tvshows: {
        Row: {
          backdrop: string
          created_at: string
          creator: string | null
          id: string
          network: string | null
          original_title: string | null
          plot: string
          poster: string
          quality: string
          rating: string
          title: string
          total_episodes: number
          total_seasons: number
          updated_at: string
          year: string
        }
        Insert: {
          backdrop: string
          created_at?: string
          creator?: string | null
          id?: string
          network?: string | null
          original_title?: string | null
          plot: string
          poster: string
          quality: string
          rating: string
          title: string
          total_episodes?: number
          total_seasons?: number
          updated_at?: string
          year: string
        }
        Update: {
          backdrop?: string
          created_at?: string
          creator?: string | null
          id?: string
          network?: string | null
          original_title?: string | null
          plot?: string
          poster?: string
          quality?: string
          rating?: string
          title?: string
          total_episodes?: number
          total_seasons?: number
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
