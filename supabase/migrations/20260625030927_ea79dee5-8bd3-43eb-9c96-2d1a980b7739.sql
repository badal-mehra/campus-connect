
-- Roles (separate table per security best practices)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'tutor', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Verified flag on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  package_id UUID,
  package_name TEXT NOT NULL DEFAULT '',
  session_date DATE NOT NULL,
  session_time TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'Online',
  amount INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending Confirmation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bookings_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = student_id OR auth.uid() = tutor_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Students create bookings"   ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Tutors update own bookings" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = tutor_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = tutor_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete bookings"     ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Authors update reviews"  ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Authors delete reviews"  ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = student_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grade proofs
CREATE TABLE IF NOT EXISTS public.grade_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT '',
  topics TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  proof_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tutor_id, subject)
);
GRANT SELECT ON public.grade_proofs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grade_proofs TO authenticated;
GRANT ALL ON public.grade_proofs TO service_role;
ALTER TABLE public.grade_proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Grade proofs are public" ON public.grade_proofs FOR SELECT USING (true);
CREATE POLICY "Tutors manage own proofs" ON public.grade_proofs FOR ALL TO authenticated USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);
CREATE TRIGGER update_grade_proofs_updated_at BEFORE UPDATE ON public.grade_proofs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Availability
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time_slot TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability TO authenticated;
GRANT ALL ON public.availability TO service_role;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Availability is public" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Tutors manage own availability" ON public.availability FOR ALL TO authenticated USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON public.availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tutor stats recalculation RPC (no-op placeholder; profiles has no aggregate columns yet)
CREATE OR REPLACE FUNCTION public.recalculate_tutor_stats(p_tutor_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Reserved for future denormalized stats; intentionally a no-op for now.
  PERFORM 1 WHERE p_tutor_id IS NOT NULL;
END;
$$;
