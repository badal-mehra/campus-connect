-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS response_time TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timings TEXT NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'Online';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badge TEXT NOT NULL DEFAULT 'New Tutor';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sessions INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_earnings INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;

-- Update role constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'tutor', 'admin'));

-- Drop existing constraint and add new ones
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_badge_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_badge_check CHECK (badge IN ('New Tutor', 'Rising Tutor', 'Top Tutor', 'Elite Tutor'));

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_mode_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_mode_check CHECK (mode IN ('Online', 'Offline', 'Both'));

-- Function to recalculate tutor stats
CREATE OR REPLACE FUNCTION public.recalculate_tutor_stats(p_tutor_id UUID)
RETURNS void AS $$
DECLARE
  v_total_sessions INTEGER;
  v_total_earnings INTEGER;
  v_avg_rating NUMERIC(2,1);
BEGIN
  SELECT COUNT(*), COALESCE(SUM(amount), 0)
  INTO v_total_sessions, v_total_earnings
  FROM public.bookings
  WHERE tutor_id = p_tutor_id AND status = 'Completed';
  
  SELECT ROUND(AVG(rating), 1)
  INTO v_avg_rating
  FROM public.reviews
  WHERE tutor_id = p_tutor_id;
  
  UPDATE public.profiles
  SET 
    total_sessions = v_total_sessions,
    total_earnings = v_total_earnings
  WHERE id = p_tutor_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;
