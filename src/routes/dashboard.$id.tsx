import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTutor, type Tutor, type Booking } from "@/lib/tutors-data";
import {
  BadgeCheck, Calendar, CheckCircle2, CircleDashed, Clock, IndianRupee,
  ShieldCheck, Star, TrendingUp, User, XCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/$id")({
  loader: ({ params }): { tutor: Tutor } => {
    const tutor = getTutor(params.id);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.tutor.name} — Dashboard` : "Dashboard — Cognitute" },
    ],
  }),
  component: DashboardPage,
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

function DashboardPage() {
  const { tutor } = Route.useLoaderData() as { tutor: Tutor };
  const upcoming = tutor.bookings.filter((b) => b.status === "Upcoming" || b.status === "Pending Confirmation");
  const completed = tutor.bookings.filter((b) => b.status === "Completed");
  const totalReviews = Object.values(tutor.ratingBreakdown).reduce((a, b) => a + b, 0);
  const verificationItems = [
    { key: "emailVerified", label: "Email verified", done: tutor.verification.emailVerified },
    { key: "collegeIdVerified", label: "College ID verified", done: tutor.verification.collegeIdVerified },
    { key: "gradesVerified", label: "Grade transcripts verified", done: tutor.verification.gradesVerified },
    { key: "payoutSetup", label: "Payout / bank setup", done: tutor.verification.payoutSetup },
    { key: "backgroundCheck", label: "Background check", done: tutor.verification.backgroundCheck },
  ];
  const verifiedCount = verificationItems.filter((v) => v.done).length;
  const verifiedPct = Math.round((verifiedCount / verificationItems.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={tutor.avatar} alt={tutor.name} className="h-16 w-16 rounded-2xl shadow-elegant" />
              <div>
                <p className="text-xs uppercase tracking-widest text-white/60">Tutor dashboard</p>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Welcome, {tutor.name.split(" ")[0]}</h1>
                <p className="mt-1 text-sm text-white/70">{tutor.college} • CGPA {tutor.cgpa.toFixed(2)} • {tutor.badge}</p>
              </div>
            </div>
            <Button asChild variant="hero" size="lg">
              <Link to="/tutors/$id" params={{ id: tutor.id }}>View public profile</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Calendar} label="Upcoming sessions" value={String(upcoming.length)} />
            <StatCard icon={TrendingUp} label="Total sessions" value={String(tutor.totalSessions)} />
            <StatCard icon={Star} label="Avg. rating" value={`${tutor.rating} (${totalReviews})`} />
            <StatCard icon={IndianRupee} label="Lifetime earnings" value={`₹${tutor.totalEarnings.toLocaleString("en-IN")}`} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="mt-6 space-y-8">
            <BookingList title="Upcoming & pending" bookings={upcoming} emptyText="No upcoming sessions yet." />
            <BookingList title="Completed" bookings={completed} emptyText="No completed sessions yet." />
            <BookingList title="Cancelled" bookings={tutor.bookings.filter((b) => b.status === "Cancelled")} emptyText="No cancellations — nice." />
          </TabsContent>

          {/* AVAILABILITY */}
          <TabsContent value="availability" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Weekly availability</h2>
                  <p className="text-sm text-muted-foreground">Click a slot to toggle it (demo).</p>
                </div>
                <Button variant="brand" size="sm" onClick={() => toast.success("Availability saved")}>
                  Save changes
                </Button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tutor.availability.map((day) => (
                  <div key={day.day} className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{day.day}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {day.slots.length === 0 && <span className="text-xs text-muted-foreground">No slots</span>}
                      {day.slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => toast(`Slot ${day.day} ${s} toggled`)}
                          className="rounded-md border border-cyan-glow/30 bg-cyan-glow/10 px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:bg-cyan-glow/20"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews" className="mt-6 space-y-6">
            <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[200px_1fr]">
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
          </TabsContent>

          {/* VERIFICATION */}
          <TabsContent value="verification" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">Profile verification</h2>
                    <p className="text-sm text-muted-foreground">{verifiedCount} of {verificationItems.length} completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-brand">{verifiedPct}%</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Verified</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-brand transition-all" style={{ width: `${verifiedPct}%` }} />
              </div>

              <ul className="mt-6 divide-y divide-border">
                {verificationItems.map((v) => (
                  <li key={v.key} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {v.done
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        : <CircleDashed className="h-5 w-5 text-muted-foreground" />}
                      <span className={`text-sm font-medium ${v.done ? "" : "text-muted-foreground"}`}>{v.label}</span>
                    </div>
                    {v.done
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><BadgeCheck className="h-3 w-3" /> Verified</span>
                      : <Button variant="brandOutline" size="sm" onClick={() => toast("Verification step started")}>Complete</Button>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-bold"><User className="h-4 w-4 text-brand" /> Profile snapshot</div>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row k="Name" v={tutor.name} />
                  <Row k="College" v={tutor.college} />
                  <Row k="Branch / Year" v={`${tutor.branch} • ${tutor.year}`} />
                  <Row k="CGPA" v={tutor.cgpa.toFixed(2)} />
                  <Row k="Roll No." v={tutor.rollNo} />
                  <Row k="City" v={tutor.city} />
                </dl>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-bold"><Clock className="h-4 w-4 text-brand" /> Tutor metrics</div>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row k="Badge" v={tutor.badge} />
                  <Row k="Response time" v={tutor.responseTime} />
                  <Row k="Experience" v={tutor.experience} />
                  <Row k="Subjects" v={tutor.subjects.join(", ")} />
                  <Row k="Mode" v={tutor.mode} />
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function BookingList({ title, bookings, emptyText }: { title: string; bookings: Booking[]; emptyText: string }) {
  return (
    <div>
      <h2 className="mb-3 text-base font-bold tracking-tight">{title} <span className="text-muted-foreground">({bookings.length})</span></h2>
      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="divide-y divide-border">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold">{b.student} <span className="font-normal text-muted-foreground">• {b.subject}</span></p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.package}</p>
                  <p className="mt-1 text-xs"><Clock className="-mt-0.5 mr-1 inline h-3 w-3" />{b.date}, {b.time} • {b.mode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={b.status} />
                  <span className="text-sm font-black text-brand">₹{b.amount.toLocaleString("en-IN")}</span>
                  {b.status === "Pending Confirmation" && (
                    <Button size="sm" variant="brand" onClick={() => toast.success("Booking confirmed")}>Accept</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
    "Upcoming": { cls: "bg-cyan-glow/10 text-brand border-cyan-glow/30", icon: Clock },
    "Pending Confirmation": { cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30", icon: CircleDashed },
    "Completed": { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
    "Cancelled": { cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30", icon: XCircle },
  };
  const { cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon className="h-3 w-3" /> {status}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
