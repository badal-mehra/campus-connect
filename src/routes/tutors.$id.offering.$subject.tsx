import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getTutor, type Package, type Tutor } from "@/lib/tutors-data";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
  Star,
  Timer,
  Trophy,
  UserRound,
} from "lucide-react";

export const Route = createFileRoute("/tutors/$id/offering/$subject")({
  loader: ({ params }): { tutor: Tutor; subject: string } => {
    const tutor = getTutor(params.id);
    if (!tutor) throw notFound();
    const subject = decodeURIComponent(params.subject);
    if (!tutor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())) {
      throw notFound();
    }
    return { tutor, subject };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.subject} with ${loaderData.tutor.name} — Cognitute`
          : "Subject — Cognitute",
      },
      {
        name: "description",
        content: loaderData
          ? `Learn ${loaderData.subject} 1-on-1 from ${loaderData.tutor.name}, ${loaderData.tutor.year} ${loaderData.tutor.branch}.`
          : "",
      },
    ],
  }),
  component: OfferingPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Offering not found</h1>
        <Button asChild className="mt-6" variant="brand">
          <Link to="/tutors">Back to tutors</Link>
        </Button>
      </div>
    </div>
  ),
});

function OfferingPage() {
  const { tutor, subject } = Route.useLoaderData() as {
    tutor: Tutor;
    subject: string;
  };
  const proof = tutor.gradeProof.find(
    (g) => g.subject.toLowerCase() === subject.toLowerCase(),
  );
  const grade = proof?.grade ?? "A+";
  const totalReviews = Object.values(tutor.ratingBreakdown).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/tutors/$id"
            params={{ id: tutor.id }}
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {tutor.name.split(" ")[0]}
            's profile
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-glow/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-glow">
                <Sparkles className="h-3.5 w-3.5" /> Subject offering
              </span>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {subject}
              </h1>
              <p className="mt-2 text-base text-white/80">
                Taught 1-on-1 by{" "}
                <span className="font-semibold text-white">{tutor.name}</span> •{" "}
                {tutor.year} {tutor.branch} • {tutor.college}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 font-semibold text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" /> Grade-verified: {grade}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{tutor.rating}</span>
                  <span className="text-white/70">
                    ({totalReviews} reviews)
                  </span>
                </span>
                <span className="text-white/60">•</span>
                <span>{tutor.totalSessions} sessions delivered</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild size="lg" variant="hero">
                <a href="#packages">
                  <BookOpen className="h-4 w-4" /> Book Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="brandOutline"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/tutors/$id" params={{ id: tutor.id }}>
                  <UserRound className="h-4 w-4" /> View Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="space-y-10">
          <Section title={`Why learn ${subject} from ${tutor.name.split(" ")[0]}`}>
            <p className="text-base leading-relaxed text-foreground/80">
              {tutor.bio}
            </p>
          </Section>

          <Section title="Subject credentials">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBlock
                icon={Award}
                label={`Grade in ${subject}`}
                value={`${grade} Grade — Verified`}
              />
              <InfoBlock
                icon={GraduationCap}
                label="Current CGPA"
                value={`${tutor.cgpa.toFixed(2)} / 10`}
              />
              <InfoBlock
                icon={BookOpen}
                label="Branch & Year"
                value={`${tutor.branch} • ${tutor.year}`}
              />
              <InfoBlock
                icon={BadgeCheck}
                label="College"
                value={tutor.college}
              />
              <InfoBlock
                icon={Timer}
                label="Tutoring experience"
                value={tutor.experience}
              />
              <InfoBlock
                icon={Clock}
                label="Response time"
                value={tutor.responseTime}
              />
            </div>
          </Section>

          <Section title="What you'll get">
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                `Concept-first explanations of ${subject}`,
                "Live doubt clearing — bring your own questions",
                "Curated practice sets after each session",
                "Exam-style problems with timed walkthroughs",
                "Notes & resources shared after every class",
                "Flexible scheduling — online or offline",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Tutor achievements">
            <ul className="space-y-2">
              {tutor.achievements.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm"
                >
                  <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Session details">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBlock
                icon={Clock}
                label="Available timings"
                value={tutor.timings}
              />
              <InfoBlock icon={MapPin} label="Mode" value={tutor.mode} />
            </div>
          </Section>

          <Section title="Other subjects this tutor offers">
            <div className="flex flex-wrap gap-2">
              {tutor.subjects
                .filter((s) => s.toLowerCase() !== subject.toLowerCase())
                .map((s) => (
                  <Link
                    key={s}
                    to="/tutors/$id/offering/$subject"
                    params={{ id: tutor.id, subject: s }}
                    className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-cyan-glow hover:text-white"
                  >
                    {s}
                  </Link>
                ))}
            </div>
          </Section>
        </main>

        <aside className="lg:sticky lg:top-24 lg:h-fit" id="packages">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-base font-bold tracking-tight">
              Book {subject} sessions
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Pay only when you book. Cancel anytime before the session.
            </p>
            <div className="mt-4 space-y-3">
              {tutor.packages.map((p) => (
                <PackageRow
                  key={p.id}
                  pkg={p}
                  tutorId={tutor.id}
                  subject={subject}
                />
              ))}
            </div>
            <Button
              asChild
              variant="brandOutline"
              className="mt-4 w-full"
              size="sm"
            >
              <Link to="/tutors/$id" params={{ id: tutor.id }}>
                <UserRound className="h-4 w-4" /> View Full Profile
              </Link>
            </Button>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function PackageRow({
  pkg,
  tutorId,
}: {
  pkg: Package;
  tutorId: string;
  subject: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4 transition-colors hover:border-cyan-glow">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{pkg.name}</p>
          <p className="text-xs text-muted-foreground">
            {pkg.duration} • {pkg.sessions} session
            {pkg.sessions > 1 ? "s" : ""}
          </p>
        </div>
        <p className="shrink-0 text-base font-black text-brand">
          ₹{pkg.price.toLocaleString("en-IN")}
        </p>
      </div>
      <Button asChild size="sm" variant="brand" className="mt-3 w-full">
        <Link
          to="/book/$id"
          params={{ id: tutorId }}
          search={{ pkg: pkg.id }}
        >
          Book Now
        </Link>
      </Button>
    </div>
  );
}
