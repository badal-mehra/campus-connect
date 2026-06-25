
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS badge TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'Online',
  ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS response_time TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS experience TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS timings TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS total_sessions INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_earnings INTEGER NOT NULL DEFAULT 0;

-- Lock down SECURITY DEFINER helpers so only backend code calls them.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE ALL ON FUNCTION public.recalculate_tutor_stats(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_tutor_stats(uuid) TO service_role;
