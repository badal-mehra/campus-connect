import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTutorById, getTutorBookings, type TutorProfile } from "@/lib/tutors.functions";
import { updateBooking } from "@/lib/bookings.functions";
import type { Tables } from "@/integrations/supabase/types";
import { BadgeCheck, Calendar, CircleCheck as CheckCircle2, CircleDashed, Clock, IndianRupee, ShieldCheck, Star, TrendingUp, User, Circle as XCircle, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";

type Booking = Tables<"bookings">;

export const Route = createFileRoute("/dashboard/$id")({
  head: () => ({
    meta: [{ title: "Tutor Dashboard — Cognitute" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const tutorId = Route.useParams().id;
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTutor = useServerFn(getTutorById);
  const fetchBookings = useServerFn(getTutorBookings);
  const confirmBooking = useServerFn(updateBooking);

  useEffect(() => {
    Promise.all([fetchTutor(tutorId), fetchBookings(tutorId)])
      .then(([tutorData, bookingsData]) => {
        setTutor(tutorData);
        setBookings(bookingsData as Booking[]);
      })
      .catch((e) => {
        console.error("Failed to load dashboard:", e);
      })
      .finally(() => setLoading(false));
  }, [tutorId, fetchTutor, fetchBookings]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await confirmBooking({ booking_id: bookingId, status: "Upcoming" });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "Upcoming" } : b))
      );
      toast.success("Booking confirmed");
    } catch (e) {
      toast.error("Failed to confirm booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <Button asChild className="mt-6" variant="brand"><Link to="/profile">Edit your profile</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const upcoming = bookings.filter((b) => b.status === "Upcoming" || b.status === "Pending Confirmation");
  const completed = bookings.filter((b) => b.status === "Completed");
  const totalReviews = Object.values(tutor.rating_breakdown).reduce((a, b) => a + b, 0);
  const verificationItems = [
    { key: "is_verified", label: "Profile verified", done: tutor.is_verified },
    { key: "subjects", label: "Subjects added", done: (tutor.subjects?.length || 0) > 0 },
    { key: "packages", label: "Packages set up", done: tutor.packages.length > 0 },
    { key: "availability", label: "Availability configured", done: tutor.availability.length > 0 },
  ];
  const verifiedCount = verificationItems.filter((v) => v.done).length;
  const verifiedPct = Math.round((verifiedCount / verificationItems.length) * 100);
  const avatarUrl = tutor.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(tutor.full_name || "User")}&backgroundColor=1B2B5E,00C6FF`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={avatarUrl} alt={tutor.full_name || "Tutor"} className="h-16 w-16 rounded-2xl shadow-elegant" />
              <div>
                <p className="text-xs uppercase tracking-widest text-white/60">Tutor dashboard</p>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Welcome, {tutor.full_name?.split(" ")[0] || "Tutor"}</h1>
                <p className="mt-1 text-sm text-white/70">{tutor.college} • {tutor.badge}</p>
              </div>
            </div>
            <Button asChild variant="hero" size="lg">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Calendar} label="Upcoming sessions" value={String(upcoming.length)} />
            <StatCard icon={TrendingUp} label="Total sessions" value={String(tutor.total_sessions)} />
            <StatCard icon={Star} label="Avg. rating" value={`${tutor.rating} (${totalReviews})`} />
            <StatCard icon={IndianRupee} label="Lifetime earnings" value={`₹${tutor.total_earnings.toLocaleString("en-IN")}`} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-2">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6 space-y-8">
            <BookingList title="Upcoming & pending" bookings={upcoming} emptyText="No upcoming sessions yet." onAccept={handleAcceptBooking} />
            <BookingList title="Completed" bookings={completed} emptyText="No completed sessions yet." />
            <BookingList title="Cancelled" bookings={bookings.filter((b) => b.status === "Cancelled")} emptyText="No cancellations." />
          </TabsContent>

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
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><BadgeCheck className="h-3 w-3" /> Done</span>
                      : <Button asChild variant="brandOutline" size="sm"><Link to="/profile">Complete</Link></Button>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-bold"><User className="h-4 w-4 text-brand" /> Profile snapshot</div>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row k="Name" v={tutor.full_name || "Not set"} />
                  <Row k="College" v={tutor.college || "Not set"} />
                  <Row k="Branch / Year" v={`${tutor.branch} • ${tutor.year}`} />
                  <Row k="CGPA" v={tutor.cgpa ? tutor.cgpa.toFixed(2) : "Not set"} />
                  <Row k="City" v={tutor.city || "Not set"} />
                </dl>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-bold"><Clock className="h-4 w-4 text-brand" /> Tutor metrics</div>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row k="Badge" v={tutor.badge} />
                  <Row k="Response time" v={tutor.response_time || "Not set"} />
                  <Row k="Experience" v={tutor.experience || "Not set"} />
                  <Row k="Subjects" v={(tutor.subjects || []).join(", ") || "None"} />
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

function BookingList({ title, bookings, emptyText, onAccept }: { title: string; bookings: Booking[]; emptyText: string; onAccept?: (id: string) => void }) {
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
                  <p className="text-sm font-bold">{b.student_name || "Student"} <span className="font-normal text-muted-foreground">• {b.subject}</span></p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.package_name}</p>
                  <p className="mt-1 text-xs"><Clock className="-mt-0.5 mr-1 inline h-3 w-3" />{b.session_date}, {b.session_time} • {b.mode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={b.status} />
                  <span className="text-sm font-black text-brand">₹{b.amount.toLocaleString("en-IN")}</span>
                  {b.status === "Pending Confirmation" && onAccept && (
                    <Button size="sm" variant="brand" onClick={() => onAccept(b.id)}>Accept</Button>
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
    "Upcoming": { cls: "bg-cyan-glow/10 text-brand border-cyan-glow/30", icon: Clock },
    "Pending Confirmation": { cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30", icon: CircleDashed },
    "Completed": { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
    "Cancelled": { cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30", icon: XCircle },
  };
  const { cls, icon: Icon } = map[status] || map["Upcoming"];
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
