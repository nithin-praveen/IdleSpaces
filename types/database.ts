export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ==============================================================================
// DOMAIN ENUMS & LITERALS
// ==============================================================================

export type UserRole = 'admin' | 'ngo' | 'corporate';

export type UserTier = 1 | 2; // 1 = NGO, 2 = Corporate

export type SpaceType = 'auditorium' | 'computer_lab' | 'ground';

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'completed'
  | 'cancelled';

export type ReportPhase = 'check-in' | 'check-out';

export type AuditAction =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITLISTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | string;

// ==============================================================================
// TABLE ROW INTERFACES
// ==============================================================================

export type User = {
  id: string; // uuid, references auth.users(id)
  role: UserRole;
  name: string;
  tier: UserTier;
  created_at: string; // ISO 8601 timestamp
  updated_at: string;
};

export type Space = {
  id: string; // uuid
  name: string;
  type: SpaceType;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string; // uuid
  user_id: string; // uuid -> users.id
  space_id: string; // uuid -> spaces.id
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  status: BookingStatus;
  eligibility_doc_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string; // uuid
  booking_id: string | null; // uuid -> bookings.id
  action: AuditAction;
  reason: string | null; // Mandatory when action is 'REJECTED'
  performed_by: string; // uuid -> users.id
  created_at: string;
};

export type ConditionReport = {
  id: string; // uuid
  booking_id: string; // uuid -> bookings.id
  phase: ReportPhase;
  photo_url: string;
  notes: string | null;
  damage_reported: boolean;
  created_at: string;
};

// ==============================================================================
// INSERT & UPDATE TYPES
// ==============================================================================

export type UserInsert = {
  id: string;
  role?: UserRole;
  name: string;
  tier?: UserTier;
  created_at?: string;
  updated_at?: string;
};

export type UserUpdate = {
  role?: UserRole;
  name?: string;
  tier?: UserTier;
  updated_at?: string;
};

export type SpaceInsert = {
  id?: string;
  name: string;
  type: SpaceType;
  capacity: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SpaceUpdate = {
  name?: string;
  type?: SpaceType;
  capacity?: number;
  is_active?: boolean;
  updated_at?: string;
};

export type BookingInsert = {
  id?: string;
  user_id: string;
  space_id: string;
  start_date: string;
  end_date: string;
  status?: BookingStatus;
  eligibility_doc_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BookingUpdate = {
  space_id?: string;
  start_date?: string;
  end_date?: string;
  status?: BookingStatus;
  eligibility_doc_url?: string | null;
  updated_at?: string;
};

export type AuditLogInsert = {
  id?: string;
  booking_id?: string | null;
  action: AuditAction;
  reason?: string | null;
  performed_by: string;
  created_at?: string;
};

export type AuditLogUpdate = Partial<AuditLogInsert>;

export type ConditionReportInsert = {
  id?: string;
  booking_id: string;
  phase: ReportPhase;
  photo_url: string;
  notes?: string | null;
  damage_reported?: boolean;
  created_at?: string;
};

export type ConditionReportUpdate = {
  photo_url?: string;
  notes?: string | null;
  damage_reported?: boolean;
};

// ==============================================================================
// COMPOSITE & EXTENDED TYPES (Useful for UI views & Joins)
// ==============================================================================

export type BookingWithDetails = Booking & {
  user?: User;
  space?: Space;
  condition_reports?: ConditionReport[];
  audit_logs?: AuditLog[];
};

// ==============================================================================
// SUPABASE CLIENT DATABASE MAPPING
// Must conform to GenericSchema: { Tables, Views, Functions }
// GenericTable: { Row, Insert, Update, Relationships: GenericRelationship[] }
// ==============================================================================

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
        Relationships: [];
      };
      spaces: {
        Row: Space;
        Insert: SpaceInsert;
        Update: SpaceUpdate;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: BookingInsert;
        Update: BookingUpdate;
        Relationships: [
          {
            foreignKeyName: 'bookings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
        Relationships: [
          {
            foreignKeyName: 'audit_logs_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_logs_performed_by_fkey';
            columns: ['performed_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      condition_reports: {
        Row: ConditionReport;
        Insert: ConditionReportInsert;
        Update: ConditionReportUpdate;
        Relationships: [
          {
            foreignKeyName: 'condition_reports_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    Views: {};
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      space_type: SpaceType;
      booking_status: BookingStatus;
      report_phase: ReportPhase;
    };
    CompositeTypes: Record<string, never>;
  };
}
