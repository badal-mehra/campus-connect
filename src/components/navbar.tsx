import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle()
          .then(({ data: profile }) => setIsAdmin(profile?.role === "admin"));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle()
          .then(({ data: profile }) => setIsAdmin(profile?.role === "admin"));
      } else {
        setIsAdmin(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Signed out");
    router.invalidate();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-brand-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">Cognitute</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/tutors">Find Tutor</NavLink>
          <NavLink to="/become-tutor">Become a Tutor</NavLink>
          {user && <NavLink to="/profile">Profile</NavLink>}
          {user && user.id && <NavLink to="/dashboard/$id" params={{ id: user.id }}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin"><Shield className="h-4 w-4 inline mr-1" />Admin</NavLink>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="hidden text-xs text-muted-foreground lg:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Login</Link></Button>
          )}
          <Button asChild size="sm" variant="brand">
            <Link to="/tutors">Find a Tutor</Link>
          </Button>
        </div>

        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link to="/tutors" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Find Tutor</Link>
            <Link to="/become-tutor" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Become a Tutor</Link>
            {user && <Link to="/profile" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Profile</Link>}
            {user && user.id && <Link to="/dashboard/$id" params={{ id: user.id }} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand hover:bg-secondary"><Shield className="h-4 w-4 inline mr-1" />Admin Panel</Link>}
            {user ? (
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setOpen(false); handleSignOut(); }}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="justify-start">
                <Link to="/auth" onClick={() => setOpen(false)}>Login</Link>
              </Button>
            )}
            <Button asChild size="sm" variant="brand">
              <Link to="/tutors" onClick={() => setOpen(false)}>Find a Tutor</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, params, children }: { to: string; params?: Record<string, string>; children: React.ReactNode }) {
  return (
    <Link
      to={to as never}
      params={params as never}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </Link>
  );
}
