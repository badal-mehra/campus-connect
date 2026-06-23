import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Search,
  CalendarCheck,
  TrendingUp,
  Clock,
  Zap,
  CalendarRange,
  GraduationCap,
  Sparkles,
  Award,
  Crown,
  Trophy,
  Star,
  CheckCircle2,
  ArrowRight,
  Shield,
} from "lucide-react";
import { tutors } from "@/lib/tutors-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cognitute — Find Your Campus Tutor in Minutes" },
      { name: "description", content: "Peer-to-peer campus tutoring. Top-ranked seniors. Verified grades. Real results." },
      { property: "og:title", content: "Cognitute — Find Your Campus Tutor in Minutes" },
      { property: "og:description", content: "Top-ranked seniors. Verified grades. Real results." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Packages />
      <BadgeSystem />
      <FeaturedTutors />
      <CTASection />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-brand-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.78_0.17_224/0.18),transparent_50%)]" />
      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-glow/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-glow backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Verified senior tutors • Live on 50+ campuses</span>
          </div>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Find Your Campus Tutor <br className="hidden sm:block" />
            <span className="text-cyan-glow">in Minutes.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-white/75 sm:text-lg">
            Top-ranked seniors. Verified grades. Real results. Cognitute connects you with the junior-friendly seniors who just cracked the subject you're stuck on.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="hero">
              <Link to="/tutors">Find a Tutor <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Link to="/become-tutor">Become a Tutor</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-cyan-glow" /> Grade-verified tutors</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-glow" /> ₹49 trial sessions</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-cyan-glow" /> 4.8 avg rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "500+", label: "Sessions completed" },
    { value: "200+", label: "Verified tutors" },
    { value: "50+", label: "Subjects covered" },
    { value: "4.8", label: "Avg student rating" },
  ];
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-black tracking-tight text-brand sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Browse verified senior tutors", desc: "Filter by subject, budget, mode and rating. Every tutor's grade is verified." },
    { icon: CalendarCheck, title: "Book a session or package", desc: "From 1-hour doubt clearing to full-semester plans. Pay only when you book." },
    { icon: TrendingUp, title: "Learn, grow, get better grades", desc: "Rate your tutor, climb the syllabus, and walk into exams ready." },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="How it works" title="From stuck to scoring in 3 steps" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="group relative rounded-2xl border border-border bg-card p-7 shadow-soft shadow-card-hover">
            <div className="absolute right-6 top-6 text-5xl font-black text-secondary">0{i + 1}</div>
            <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-soft">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Packages() {
  const pkgs = [
    { icon: Clock, name: "Quick Session", duration: "1 hour", desc: "Doubt clearing — clear urgent doubts in a focused hour.", price: "₹149+" },
    { icon: Zap, name: "Exam Rescue", duration: "2 weeks", desc: "Last-minute prep — intensive sprint before finals.", price: "₹999+" },
    { icon: CalendarRange, name: "Monthly Plan", duration: "12 sessions", desc: "Regular help — consistent weekly checkpoints.", price: "₹1,799+" },
    { icon: GraduationCap, name: "Full Semester", duration: "4 months", desc: "Complete subject mastery — end-to-end ownership.", price: "₹5,499+" },
  ];
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Packages" title="Pick the plan that fits your panic" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pkgs.map((p) => (
            <div key={p.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft shadow-card-hover">
              <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-accent text-brand">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight">{p.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-glow">{p.duration}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Starting at</p>
                  <p className="text-xl font-black tracking-tight text-brand">{p.price}</p>
                </div>
                <Button asChild size="sm" variant="brandOutline">
                  <Link to="/tutors">View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BadgeSystem() {
  const badges = [
    { icon: Sparkles, name: "New Tutor", desc: "Just joined", color: "from-slate-400 to-slate-500" },
    { icon: Award, name: "Rising Tutor", desc: "20+ sessions", color: "from-emerald-400 to-teal-500" },
    { icon: Trophy, name: "Top Tutor", desc: "75+ sessions • 4.5★", color: "from-sky-400 to-cyan-500" },
    { icon: Crown, name: "Elite Tutor", desc: "150+ sessions • 4.8★", color: "from-amber-400 to-orange-500" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Tutor reputation" title="A badge system that actually means something" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b, i) => (
          <div key={b.name} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${b.color} text-white shadow-soft`}>
              <b.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold tracking-tight">{b.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            {i < badges.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedTutors() {
  const featured = tutors.slice(0, 3);
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Featured tutors" title="The seniors students keep coming back to" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((t) => (
            <Link
              key={t.id}
              to="/tutors/$id"
              params={{ id: t.id }}
              className="group block rounded-2xl border border-border bg-card p-6 shadow-soft shadow-card-hover"
            >
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-xl" />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold tracking-tight">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.year} • {t.branch}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.subjects.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-brand">{s}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{t.rating}</span>
                  <span className="text-muted-foreground">({t.totalSessions})</span>
                </div>
                <span className="text-sm font-bold text-brand">₹{t.startingPrice}+</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="brand">
            <Link to="/tutors">Browse all tutors <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-brand-foreground shadow-elegant sm:p-16">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-glow/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-glow/20 blur-3xl" />
        <h2 className="relative text-balance text-3xl font-black tracking-tight sm:text-5xl">
          Ready to actually understand the syllabus?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/75">
          Start with a ₹49 trial session. No commitment, no awkwardness — just a senior who's been exactly where you are.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="xl" variant="hero">
            <Link to="/tutors">Find a Tutor</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <Link to="/become-tutor">Teach & earn</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
