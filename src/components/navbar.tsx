import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-brand-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Cognitute
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/tutors"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Find Tutor
          </Link>
          <Link
            to="/become-tutor"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Become a Tutor
          </Link>
          <Link
            to="/dashboard/$id"
            params={{ id: "aarav-sharma" }}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Tutor Dashboard
          </Link>
          <Link
            to="/"
            hash="how-it-works"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            How it works
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">Login</Button>
          <Button asChild size="sm" variant="brand">
            <Link to="/tutors">Find a Tutor</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link to="/tutors" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Find Tutor</Link>
            <Link to="/become-tutor" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">Become a Tutor</Link>
            <Button variant="ghost" size="sm" className="justify-start">Login</Button>
            <Button asChild size="sm" variant="brand">
              <Link to="/tutors" onClick={() => setOpen(false)}>Find a Tutor</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
