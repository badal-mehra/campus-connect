import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getTutorById, type TutorProfile } from "@/lib/tutors.functions";
import { ArrowLeft, Award, BadgeCheck, BookOpen, CircleCheck as CheckCircle2, ChevronRight, Clock, GraduationCap, Globe, Loader as Loader2, Mail, MapPin, Phone, Star, Timer, Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/tutors/$id/")({
  head: ({ params }) => ({
    meta: [{ title: `Tutor — Cognitute` }],
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

type GradeProof = { subject: string; grade: string; topics: string[]; description: string };
type Package = { id: string; name: string; duration: string; sessions: number; price: number };
type Review = { id: string; student_name: string; rating: number; comment: string; created_at: string };

function TutorProfile() {
  const tutorId = Route.useParams().id;
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

  const fetchTutor = useServerFn(getTutorById);

  useEffect(() => {
    fetchTutor(tutorId)
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setTutor(data);
        }
      })
      .catch((e) => {
        console.error("Failed to load tutor:", e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [tutorId, fetchTutor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" />
          <p className="mt-4 text-muted-foreground">Loading tutor profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFoundState || !tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Tutor not found</h1>
          <Button asChild className="mt-6" variant="brand"><Link to="/tutors">Back to tutors</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalReviews = Object.values(tutor.rating_breakdown).reduce((a, b) => a + b, 0);
  const avatarUrl = tutor.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(tutor.full_name || "User")}&backgroundColor=1B2B5E,00C6FF`;

  const gradeProofs: GradeProof[] = tutor.grade_proofs.map((gp) => ({
    subject: gp.subject,
    grade: gp.grade,
    topics: gp.topics || [],
    description: gp.description,
  }));

  const packages: Package[] = tutor.packages.map((p) => ({
    id: p.id,
    name: p.name,
    duration: p.duration,
    sessions: p.sessions,
    price: p.price,
  }));

  const reviews: Review[] = tutor.reviews.map((r) => ({
    id: r.id,
    student_name: r.student_name,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/tutors" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to tutors
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <img src={avatarUrl} alt={tutor.full_name || "Tutor"} className="h-24 w-24 rounded-2xl shadow-elegant" />
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tutor.full_name || "Anonymous Tutor"}</h1>
              <p className="mt-1 text-sm text-white/70">{tutor.year} • {tutor.branch}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <span className="font-semibold">{tutor.rating}</span> ({totalReviews} reviews)</span>
                <span className="text-white/60">•</span>
                <span>{tutor.total_sessions} sessions</span>
                <span className="text-white/60">•</span>
                <span className="rounded-full bg-cyan-glow/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-cyan-glow">{tutor.badge}</span>
              </div>
            </div>
            <Button asChild size="lg" variant="hero">
              <Link to="/book/$id" params={{ id: tutor.id }}>
                <Zap className="h-4 w-4" /> Book Session
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="space-y-10">
          <Section title="About">
            <p className="text-base leading-relaxed text-foreground/80">{tutor.bio || "No bio provided yet."}</p>
          </Section>

          <Section title="Academic profile">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBlock icon={GraduationCap} label="College" value={tutor.college || "Not specified"} />
              <InfoBlock icon={BookOpen} label="Branch & Year" value={`${tutor.branch} • ${tutor.year}`} />
              {tutor.cgpa && <InfoBlock icon={Award} label="Current CGPA" value={`${tutor.cgpa.toFixed(2)} / 10`} />}
              {tutor.roll_no && <InfoBlock icon={BadgeCheck} label="Roll Number" value={tutor.roll_no} />}
              <InfoBlock icon={Timer} label="Experience" value={tutor.experience || "Not specified"} />
              <InfoBlock icon={Clock} label="Response time" value={tutor.response_time || "Usually within a few hours"} />
            </div>
          </Section>

          {(tutor.city || (tutor.languages && tutor.languages.length > 0)) && (
            <Section title="Contact & location">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock icon={MapPin} label="City" value={tutor.city || "Not specified"} />
                <InfoBlock icon={Globe} label="Languages" value={(tutor.languages || []).join(", ") || "Not specified"} />
              </div>
            </Section>
          )}

          {tutor.achievements && tutor.achievements.length > 0 && (
            <Section title="Achievements">
              <ul className="space-y-2">
                {tutor.achievements.map((a, i) => (
                  <li key={`${a}-${i}`} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                    <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {gradeProofs.length > 0 && (
            <Section title="Subjects & offerings">
              <p className="mb-4 text-sm text-muted-foreground">Each subject below shows the tutor's verified grade, what is covered, and a direct booking link.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {gradeProofs.map((g) => (
                  <div key={g.subject} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card-hover">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold tracking-tight">{g.subject}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{g.description}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {g.grade}
                      </span>
                    </div>
                    {g.topics.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {g.topics.slice(0, 4).map((topic) => (
                          <span key={topic} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-brand">{topic}</span>
                        ))}
                        {g.topics.length > 4 && (
                          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-brand">+{g.topics.length - 4} more</span>
                        )}
                      </div>
                    )}
                    <div className="mt-5 flex items-center gap-2">
                      <Button asChild size="sm" variant="brand" className="flex-1">
                        <Link to="/tutors/$id/offering/$subject" params={{ id: tutor.id, subject: g.subject }}>
                          <BookOpen className="mr-1.5 h-4 w-4" /> Book Now
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="brandOutline" className="flex-1">
                        <Link to="/tutors/$id/offering/$subject" params={{ id: tutor.id, subject: g.subject }}>
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {tutor.subjects && tutor.subjects.length > 0 && gradeProofs.length > 0 && (
            <Section title="Other credentials">
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.filter((s) => !gradeProofs.some((g) => g.subject.toLowerCase() === s.toLowerCase())).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-brand">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBlock icon={Clock} label="Available timings" value={tutor.timings || "Contact for availability"} />
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
                  const count = tutor.rating_breakdown[star];
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
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.student_name}</p>
                      <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[1,2,3,4,5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />)}
                    </div>
                    <p className="mt-2 text-sm text-foreground/80">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
            )}
          </Section>
        </main>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-base font-bold tracking-tight">Pick a package</h3>
            <p className="mt-1 text-xs text-muted-foreground">Pay only when you book. Cancel anytime before the session.</p>
            <div className="mt-4 space-y-3">
              {packages.length > 0 ? (
                packages.map((p) => <PackageRow key={p.id} pkg={p} tutorId={tutor.id} />)
              ) : (
                <p className="text-sm text-muted-foreground">No packages available yet.</p>
              )}
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
