CREATE TABLE public.tutor_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Quick Session',
  duration TEXT NOT NULL DEFAULT '1 hour',
  sessions INTEGER NOT NULL DEFAULT 1 CHECK (sessions > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tutor_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutor_packages TO authenticated;
GRANT ALL ON public.tutor_packages TO service_role;

ALTER TABLE public.tutor_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
ON public.tutor_packages FOR SELECT
USING (is_active = true OR auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert their own packages"
ON public.tutor_packages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update their own packages"
ON public.tutor_packages FOR UPDATE
TO authenticated
USING (auth.uid() = tutor_id)
WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete their own packages"
ON public.tutor_packages FOR DELETE
TO authenticated
USING (auth.uid() = tutor_id);

CREATE INDEX idx_tutor_packages_tutor_id ON public.tutor_packages(tutor_id);

CREATE TRIGGER trg_tutor_packages_updated_at
BEFORE UPDATE ON public.tutor_packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();