export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          achievements: string[]
          avatar_url: string
          badge: string
          bio: string
          branch: string
          cgpa: number | null
          city: string
          college: string
          created_at: string
          experience: string
          full_name: string
          hourly_rate: number | null
          id: string
          is_verified: boolean
          languages: string[]
          linkedin: string
          mode: string
          phone: string
          response_time: string
          role: string
          roll_no: string
          subjects: string[]
          timings: string
          total_earnings: number
          total_sessions: number
          university: string
          updated_at: string
          year: string
        }
        Insert: {
          achievements?: string[]
          avatar_url?: string
          badge?: string
          bio?: string
          branch?: string
          cgpa?: number | null
          city?: string
          college?: string
          created_at?: string
          experience?: string
          full_name?: string
          hourly_rate?: number | null
          id: string
          is_verified?: boolean
          languages?: string[]
          linkedin?: string
          mode?: string
          phone?: string
          response_time?: string
          role?: string
          roll_no?: string
          subjects?: string[]
          timings?: string
          total_earnings?: number
          total_sessions?: number
          university?: string
          updated_at?: string
          year?: string
        }
        Update: {
          achievements?: string[]
          avatar_url?: string
          badge?: string
          bio?: string
          branch?: string
          cgpa?: number | null
          city?: string
          college?: string
          created_at?: string
          experience?: string
          full_name?: string
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          languages?: string[]
          linkedin?: string
          mode?: string
          phone?: string
          response_time?: string
          role?: string
          roll_no?: string
          subjects?: string[]
          timings?: string
          total_earnings?: number
          total_sessions?: number
          university?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      tutor_packages: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          is_active: boolean
          name: string
          price: number
          sessions: number
          tutor_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          is_active?: boolean
          name: string
          price: number
          sessions?: number
          tutor_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          sessions?: number
          tutor_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: "tutor_packages_tutor_id_fkey"; columns: ["tutor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_verified: boolean
          rating: number
          student_id: string | null
          student_name: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          rating: number
          student_id?: string | null
          student_name?: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          rating?: number
          student_id?: string | null
          student_name?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "reviews_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "reviews_tutor_id_fkey"; columns: ["tutor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      bookings: {
        Row: {
          amount: number
          created_at: string
          id: string
          mode: string
          notes: string
          package_id: string | null
          package_name: string
          session_date: string
          session_time: string
          status: string
          student_id: string | null
          student_name: string
          subject: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          mode?: string
          notes?: string
          package_id?: string | null
          package_name?: string
          session_date: string
          session_time?: string
          status?: string
          student_id?: string | null
          student_name?: string
          subject?: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          mode?: string
          notes?: string
          package_id?: string | null
          package_name?: string
          session_date?: string
          session_time?: string
          status?: string
          student_id?: string | null
          student_name?: string
          subject?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "bookings_package_id_fkey"; columns: ["package_id"]; isOneToOne: false; referencedRelation: "tutor_packages"; referencedColumns: ["id"] },
          { foreignKeyName: "bookings_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "bookings_tutor_id_fkey"; columns: ["tutor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ]
      }
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          id: string
          is_available: boolean
          time_slot: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          id?: string
          is_available?: boolean
          time_slot: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          id?: string
          is_available?: boolean
          time_slot?: string
          tutor_id?: string
        }
        Relationships: [{ foreignKeyName: "availability_tutor_id_fkey"; columns: ["tutor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      grade_proofs: {
        Row: {
          created_at: string
          description: string
          grade: string
          id: string
          is_verified: boolean
          proof_url: string
          subject: string
          topics: string[]
          tutor_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          grade?: string
          id?: string
          is_verified?: boolean
          proof_url?: string
          subject: string
          topics?: string[]
          tutor_id: string
        }
        Update: {
          created_at?: string
          description?: string
          grade?: string
          id?: string
          is_verified?: boolean
          proof_url?: string
          subject?: string
          topics?: string[]
          tutor_id?: string
        }
        Relationships: [{ foreignKeyName: "grade_proofs_tutor_id_fkey"; columns: ["tutor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_tutor_stats: { Args: { p_tutor_id: string }; Returns: undefined }
      update_updated_at_column: { Args: { _: unknown }; Returns: unknown }
      handle_new_user: { Args: { _: unknown }; Returns: unknown }
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
