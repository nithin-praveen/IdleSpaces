-- ==============================================================================
-- Schema: Government College Spaces Booking Platform (IdleSpaces)
-- Description: Fair allocation of public college assets (auditoriums, grounds, labs)
--              to NGOs and communities with transparent auditability and anti-corruption controls.
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- ENUMS
-- ==============================================================================

-- User roles:
-- 'admin': College authority / administrator
-- 'ngo': Non-governmental organization (Tier 1 priority)
-- 'corporate': Commercial / corporate entity (Tier 2 priority)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'ngo', 'corporate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Space types:
DO $$ BEGIN
    CREATE TYPE space_type AS ENUM ('auditorium', 'computer_lab', 'ground');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Booking status life cycle:
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'waitlisted', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Condition report phase:
DO $$ BEGIN
    CREATE TYPE report_phase AS ENUM ('check-in', 'check-out');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- Table 1: users
-- Represents user profiles linked to Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'ngo',
    name TEXT NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Constraint: Validate tier alignment (Tier 1 for NGO, Tier 2 for Corporate)
    CONSTRAINT chk_user_tier_role CHECK (
        (role = 'ngo' AND tier = 1) OR
        (role = 'corporate' AND tier = 2) OR
        (role = 'admin')
    )
);

-- Table 2: spaces
-- Public assets available within the government college
CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type space_type NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table 3: bookings
-- Space reservations by verified organizations
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    eligibility_doc_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Strict chronological constraint
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date)
);

-- Table 4: audit_logs
-- Immutable ledger of all booking decisions and administrative actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    reason TEXT,
    performed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Mandatory reason constraint for rejections to prevent arbitrary denial
    CONSTRAINT chk_rejection_reason_mandatory CHECK (
        action != 'REJECTED' OR (reason IS NOT NULL AND length(trim(reason)) > 0)
    )
);

-- Table 5: condition_reports
-- Proof of asset maintenance before and after usage (prevents disputes & vandalism)
CREATE TABLE IF NOT EXISTS public.condition_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    phase report_phase NOT NULL,
    photo_url TEXT NOT NULL,
    notes TEXT,
    damage_reported BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Enforce only one report per phase per booking
    CONSTRAINT uq_booking_phase UNIQUE (booking_id, phase)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & FAIR QUEUING
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role_tier ON public.users(role, tier);
CREATE INDEX IF NOT EXISTS idx_spaces_is_active_type ON public.spaces(is_active, type);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_space_id ON public.bookings(space_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON public.bookings(space_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_booking_id ON public.audit_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by ON public.audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_condition_reports_booking_id ON public.condition_reports(booking_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_spaces_updated_at
    BEFORE UPDATE ON public.spaces
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SUPABASE AUTH SYNC TRIGGER
-- Automatically creates a public.users row when a new user signs up
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
    user_tier_val INTEGER;
    raw_role TEXT;
BEGIN
    raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'ngo');
    
    IF raw_role = 'admin' THEN
        user_role_val := 'admin'::public.user_role;
        user_tier_val := 1;
    ELSIF raw_role = 'corporate' THEN
        user_role_val := 'corporate'::public.user_role;
        user_tier_val := 2;
    ELSE
        user_role_val := 'ngo'::public.user_role;
        user_tier_val := 1;
    END IF;

    INSERT INTO public.users (id, role, name, tier)
    VALUES (
        NEW.id,
        user_role_val,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Anonymous Community Member'),
        user_tier_val
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        tier = EXCLUDED.tier,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_reports ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. users policies
CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins have full access to users"
    ON public.users FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 2. spaces policies
CREATE POLICY "Spaces are viewable by anyone"
    ON public.spaces FOR SELECT
    TO authenticated, anon
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can insert or modify spaces"
    ON public.spaces FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 3. bookings policies
CREATE POLICY "Users can view their own bookings or admins can view all"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create bookings"
    ON public.bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel pending bookings"
    ON public.bookings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full control over bookings"
    ON public.bookings FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 4. audit_logs policies (Strict Transparency)
CREATE POLICY "Audit logs are viewable by admins and booking owners"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        public.is_admin() OR 
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = audit_logs.booking_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can log their actions"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = performed_by);

-- 5. condition_reports policies
CREATE POLICY "Condition reports viewable by booking owners and admins"
    ON public.condition_reports FOR SELECT
    TO authenticated
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = condition_reports.booking_id AND b.user_id = auth.uid()
        )
    );

CREATE POLICY "Booking owners or admins can submit condition reports"
    ON public.condition_reports FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = condition_reports.booking_id AND b.user_id = auth.uid()
        )
    );
