import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Search, Star, SlidersHorizontal, X } from "lucide-react";
import { tutors, allSubjects, type Tutor } from "@/lib/tutors-data";

export const Route = createFileRoute("/tutors/")({
  head: () => ({
    meta: [
      { title: "Browse Tutors — Cognitute" },
      { name: "description", content: "Browse verified senior tutors. Filter by subject, budget, mode and rating." },
      { property: "og:title", content: "Browse Tutors — Cognitute" },
      { property: "og:description", content: "Verified senior tutors. Pick your subject, pick your senior." },
    ],
  }),
  component: TutorsPage,
});

const PACKAGE_TYPES = ["Quick Session", "Exam Rescue", "Monthly Plan", "Full Semester"] as const;
const YEARS = ["2nd Year", "3rd Year", "4th Year"] as const;
const MODES = ["Online", "Offline", "Both"] as const;

function TutorsPage() {
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [pkgTypes, setPkgTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState<number[]>([5000]);
  const [modes, setModes] = useState<string[]>([]);
  const [highRated, setHighRated] = useState(false);
  const [years, setYears] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return tutors.filter((t) => {
      if (query && !t.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase())) && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (subjects.length && !subjects.some((s) => t.subjects.includes(s))) return false;
      if (pkgTypes.length && !t.packages.some((p) => pkgTypes.includes(p.type))) return false;
      if (t.startingPrice > budget[0]) return false;
      if (modes.length && !modes.includes(t.mode)) return false;
      if (highRated && t.rating < 4.0) return false;
      if (years.length && !years.includes(t.year)) return false;
      return true;
    });
  }, [query, subjects, pkgTypes, budget, modes, highRated, years]);

  const clearAll = () => {
    setSubjects([]); setPkgTypes([]); setBudget([5000]); setModes([]); setHighRated(false); setYears([]); setQuery("");
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Browse Tutors</h1>
          <p className="mt-2 text-sm text-muted-foreground">{tutors.length} verified seniors across {allSubjects.length} subjects.</p>
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by subject — DSA, Physics, DBMS..."
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button variant="brandOutline" size="lg" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <FiltersPanel
            subjects={subjects} setSubjects={setSubjects}
            pkgTypes={pkgTypes} setPkgTypes={setPkgTypes}
            budget={budget} setBudget={setBudget}
            modes={modes} setModes={setModes}
            highRated={highRated} setHighRated={setHighRated}
            years={years} setYears={setYears}
            toggle={toggle} clearAll={clearAll}
          />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-background p-5 shadow-elegant">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="rounded p-1 hover:bg-secondary"><X className="h-5 w-5" /></button>
              </div>
              <FiltersPanel
                subjects={subjects} setSubjects={setSubjects}
                pkgTypes={pkgTypes} setPkgTypes={setPkgTypes}
                budget={budget} setBudget={setBudget}
                modes={modes} setModes={setModes}
                highRated={highRated} setHighRated={setHighRated}
                years={years} setYears={setYears}
                toggle={toggle} clearAll={clearAll}
              />
            </div>
          </div>
        )}

        <main>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> tutors found</p>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">No tutors match your filters. Try widening your search.</p>
              <Button variant="brandOutline" size="sm" className="mt-4" onClick={clearAll}>Clear all filters</Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((t) => <TutorCard key={t.id} tutor={t} />)}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function FiltersPanel(props: {
  subjects: string[]; setSubjects: (v: string[]) => void;
  pkgTypes: string[]; setPkgTypes: (v: string[]) => void;
  budget: number[]; setBudget: (v: number[]) => void;
  modes: string[]; setModes: (v: string[]) => void;
  highRated: boolean; setHighRated: (v: boolean) => void;
  years: string[]; setYears: (v: string[]) => void;
  toggle: (arr: string[], setArr: (v: string[]) => void, val: string) => void;
  clearAll: () => void;
}) {
  const { subjects, setSubjects, pkgTypes, setPkgTypes, budget, setBudget, modes, setModes, highRated, setHighRated, years, setYears, toggle, clearAll } = props;
  return (
    <div className="space-y-7 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider">Filters</h3>
        <button onClick={clearAll} className="text-xs font-medium text-cyan-glow hover:underline">Clear all</button>
      </div>

      <FilterGroup title="Subject">
        <div className="space-y-2">
          {allSubjects.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={subjects.includes(s)} onCheckedChange={() => toggle(subjects, setSubjects, s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Package Type">
        <div className="space-y-2">
          {PACKAGE_TYPES.map((p) => (
            <label key={p} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={pkgTypes.includes(p)} onCheckedChange={() => toggle(pkgTypes, setPkgTypes, p)} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={`Budget — up to ₹${budget[0]}`}>
        <Slider value={budget} onValueChange={setBudget} min={0} max={5000} step={50} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>₹0</span><span>₹5000</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Mode">
        <div className="space-y-2">
          {MODES.map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={modes.includes(m)} onCheckedChange={() => toggle(modes, setModes, m)} />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <label className="flex cursor-pointer items-center justify-between text-sm">
          <span>4★ & above only</span>
          <Switch checked={highRated} onCheckedChange={setHighRated} />
        </label>
      </FilterGroup>

      <FilterGroup title="Tutor Year">
        <div className="space-y-2">
          {YEARS.map((y) => (
            <label key={y} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={years.includes(y)} onCheckedChange={() => toggle(years, setYears, y)} />
              <span>{y}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

function badgeStyles(badge: Tutor["badge"]) {
  switch (badge) {
    case "Elite Tutor": return "bg-gradient-to-r from-amber-400 to-orange-500 text-white";
    case "Top Tutor": return "bg-gradient-to-r from-sky-400 to-cyan-500 text-white";
    case "Rising Tutor": return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white";
    default: return "bg-secondary text-secondary-foreground";
  }
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft shadow-card-hover">
      <Link
        to="/tutors/$id"
        params={{ id: tutor.id }}
        className="flex items-start gap-4"
      >
        <img src={tutor.avatar} alt={tutor.name} className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold tracking-tight">{tutor.name}</h3>
              <p className="truncate text-xs text-muted-foreground">{tutor.year} • {tutor.branch}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyles(tutor.badge)}`}>
              {tutor.badge.replace(" Tutor", "")}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tutor.subjects.slice(0, 3).map((s) => (
          <Link
            key={s}
            to="/tutors/$id/offering/$subject"
            params={{ id: tutor.id, subject: s }}
            className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-brand transition-colors hover:bg-cyan-glow hover:text-white"
          >
            {s}
          </Link>
        ))}
      </div>

      <Link to="/tutors/$id" params={{ id: tutor.id }} className="mt-4 flex items-center gap-1 text-sm">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{tutor.rating}</span>
        <span className="text-muted-foreground">• {tutor.totalSessions} sessions</span>
      </Link>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-lg font-black tracking-tight text-brand">₹{tutor.startingPrice}</p>
        </div>
        <Button asChild size="sm" variant="brand">
          <Link to="/tutors/$id" params={{ id: tutor.id }}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
}
