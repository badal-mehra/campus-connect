import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getTutor, type Package, type Tutor } from "@/lib/tutors-data";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/tutors/$id")({
  loader: ({ params }): { tutor: Tutor } => {
    const tutor = getTutor(params.id);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.tutor.name} — Cognitute` : "Tutor — Cognitute" },
      { name: "description", content: loaderData ? `${loaderData.tutor.name} — ${loaderData.tutor.subjects.join(", ")}` : "" },
    ],
  }),
  component: TutorProfile,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Tutor not found</h1>
        <Button asChild className="mt-6" variant="brand"><Link to="/tutors">Back to tutors</Link></Button>
      </div>
    </div>
  ),
});

function TutorProfile() {
  const { tutor } = Route.useLoaderData() as { tutor: import("@/lib/tutors-data").Tutor };
  const totalReviews = Object.values(tutor.ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/tutors" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to tutors
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <img src={tutor.avatar} alt={tutor.name} className="h-24 w-24 rounded-2xl shadow-elegant" />
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tutor.name}</h1>
              <p className="mt-1 text-sm text-white/70">{tutor.year} • {tutor.branch}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <span className="font-semibold">{tutor.rating}</span> ({totalReviews} reviews)</span>
                <span className="text-white/60">•</span>
                <span>{tutor.totalSessions} sessions</span>
                <span className="text-white/60">•</span>
                <span className="rounded-full bg-cyan-glow/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-cyan-glow">{tutor.badge}</span>
              </div>
            </div>
            <Button size="lg" variant="hero" className="animate-pulse">
              <Zap className="h-4 w-4" /> Try 30 min for ₹49
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="space-y-10">
          <Section title="About">
            <p className="text-base leading-relaxed text-foreground/80">{tutor.bio}</p>
          </Section>

          <Section title="Grade-verified subjects">
            <div className="flex flex-wrap gap-2">
              {tutor.gradeProof.map((g) => (
                <span key={g.subject} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {g.subject} — {g.grade} Grade Verified
                </span>
              ))}
            </div>
          </Section>

          <Section title="Subjects taught">
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map((s) => (
                <span key={s} className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-brand">{s}</span>
              ))}
            </div>
          </Section>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBlock icon={Clock} label="Available timings" value={tutor.timings} />
            <InfoBlock icon={MapPin} label="Mode" value={tutor.mode} />
          </div>

          <Section title="Reviews">
            <div className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[180px_1fr]">
              <div className="text-center sm:border-r sm:border-border sm:pr-5">
                <div className="text-5xl font-black tracking-tight text-brand">{tutor.rating}</div>
                <div className="mt-1 flex justify-center gap-0.5">
                  {[1,2,3,4,5].map((i) => <Star key={i} className={`h-4 w-4 ${i <= Math.round(tutor.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{totalReviews} reviews</p>
              </div>
              <div className="space-y-1.5">
                {([5,4,3,2,1] as const).map((star) => {
                  const count = tutor.ratingBreakdown[star];
                  const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 font-medium">{star}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-brand" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3">
              {tutor.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.student}</p>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {[1,2,3,4,5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />)}
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">{r.text}</p>
                </div>
              ))}
            </div>
          </Section>
        </main>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-base font-bold tracking-tight">Pick a package</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pay only when you book. Cancel anytime before the session.</p>
            <div className="mt-4 space-y-3">
              {tutor.packages.map((p) => <PackageRow key={p.id} pkg={p} tutorId={tutor.id} />)}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-brand"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function PackageRow({ pkg, tutorId }: { pkg: Package; tutorId: string }) {
  return (
    <div className="rounded-xl border border-border p-4 transition-colors hover:border-cyan-glow">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{pkg.name}</p>
          <p className="text-xs text-muted-foreground">{pkg.duration} • {pkg.sessions} session{pkg.sessions > 1 ? "s" : ""}</p>
        </div>
        <p className="shrink-0 text-base font-black text-brand">₹{pkg.price.toLocaleString("en-IN")}</p>
      </div>
      <Button asChild size="sm" variant="brand" className="mt-3 w-full">
        <Link to="/book/$id" params={{ id: tutorId }} search={{ pkg: pkg.id }}>Book Now</Link>
      </Button>
    </div>
  );
}
