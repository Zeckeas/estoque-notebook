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
      locais: {
        Row: {
          id: number
          nome: string
          created_at: string
        }
        Insert: {
          id?: number
          nome: string
          created_at?: string
        }
        Update: {
          id?: number
          nome?: string
          created_at?: string
        }
      }
      notebooks: {
        Row: {
          id: number
          local_id: number
          quantidade: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          local_id: number
          quantidade: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          local_id?: number
          quantidade?: number
          created_at?: string
          updated_at?: string
        }
      }
      entregas: {
        Row: {
          id: number
          colaborador: string
          quantidade: number
          local_id: number
          created_at: string
        }
        Insert: {
          id?: number
          colaborador: string
          quantidade: number
          local_id: number
          created_at?: string
        }
        Update: {
          id?: number
          colaborador?: string
          quantidade?: number
          local_id?: number
          created_at?: string
        }
      }
    }
  }
}