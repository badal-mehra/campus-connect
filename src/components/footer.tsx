import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-brand-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">Cognitute</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Learn from those who just cracked it. Campus tutoring, peer-powered.
          </p>
        </div>
        <FooterCol title="Product" links={[
          { label: "Find a Tutor", to: "/tutors" },
          { label: "Become a Tutor", to: "/become-tutor" },
          { label: "Packages", to: "/" },
        ]} />
        <FooterCol title="Company" links={[
          { label: "About", to: "/" },
          { label: "Careers", to: "/" },
          { label: "Press", to: "/" },
        ]} />
        <FooterCol title="Support" links={[
          { label: "Help Center", to: "/" },
          { label: "Trust & Safety", to: "/" },
          { label: "Contact", to: "/" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Cognitute. All rights reserved.</p>
          <p>Made on campus, for campus.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
