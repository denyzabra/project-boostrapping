export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          expires_at: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          is_public?: boolean
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      poll_results: {
        Row: {
          poll_id: string | null
          poll_title: string | null
          option_id: string | null
          option_text: string | null
          vote_count: number | null
        }
        Insert: never
        Update: never
      }
    }
    Functions: {
      get_poll_results: {
        Args: { poll_uuid: string }
        Returns: {
          option_id: string
          option_text: string
          vote_count: number
        }[]
      }
    }
    Enums: {}
  }
}