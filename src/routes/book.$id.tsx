import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getTutor, type Package, type Tutor } from "@/lib/tutors-data";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Lock } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({ pkg: z.string().optional() });

export const Route = createFileRoute("/book/$id")({
  validateSearch: searchSchema,
  loader: ({ params }): { tutor: Tutor } => {
    const tutor = getTutor(params.id);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `Book ${loaderData.tutor.name} — Cognitute` : "Book — Cognitute" }],
  }),
  component: BookingPage,
});

const TIME_SLOTS = ["07:00 PM", "08:00 PM", "09:00 PM", "10:00 AM (Sat)", "11:00 AM (Sat)", "04:00 PM (Sun)"];

function nextDays(n: number) {
  const arr: { date: string; label: string; day: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    });
  }
  return arr;
}

function BookingPage() {
  const { tutor } = Route.useLoaderData() as { tutor: import("@/lib/tutors-data").Tutor };
  const { pkg: pkgParam } = Route.useSearch();
  const navigate = useNavigate();
  const initial = tutor.packages.find((p) => p.id === pkgParam) ?? tutor.packages[0];
  const [selected, setSelected] = useState<Package>(initial);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [note, setNote] = useState("");
  const [paying, setPaying] = useState(false);

  const days = nextDays(7);
  const platformFee = Math.round(selected.price * 0.05);
  const total = selected.price + platformFee;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Pick a date and time slot to continue");
      return;
    }
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      toast.success(`Booking confirmed with ${tutor.name}! Check your email.`);
      navigate({ to: "/tutors/$id", params: { id: tutor.id } });
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/tutors/$id" params={{ id: tutor.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Book a session</h1>
        <p className="mt-1 text-sm text-muted-foreground">Confirm your package, pick a time, pay securely.</p>

        <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card title="Select package">
              <div className="grid gap-3 sm:grid-cols-2">
                {tutor.packages.map((p) => {
                  const active = p.id === selected.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`rounded-xl border p-4 text-left transition-all ${active ? "border-brand bg-accent/40 shadow-soft" : "border-border hover:border-cyan-glow"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{p.name}</p>
                        {active && <CheckCircle2 className="h-4 w-4 text-brand" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.duration} • {p.sessions} session{p.sessions > 1 ? "s" : ""}</p>
                      <p className="mt-2 text-lg font-black text-brand">₹{p.price.toLocaleString("en-IN")}</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Select date" icon={CalendarDays}>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d) => {
                  const active = d.date === date;
                  return (
                    <button
                      type="button"
                      key={d.date}
                      onClick={() => setDate(d.date)}
                      className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-center transition-all ${active ? "border-brand bg-gradient-brand text-brand-foreground" : "border-border bg-card hover:border-cyan-glow"}`}
                    >
                      <span className="text-xs font-medium opacity-80">{d.day}</span>
                      <span className="mt-0.5 text-sm font-bold">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Select time slot" icon={Clock}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => {
                  const active = slot === time;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${active ? "border-brand bg-gradient-brand text-brand-foreground" : "border-border bg-card hover:border-cyan-glow"}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Note for your tutor (optional)">
              <Label htmlFor="note" className="sr-only">Note</Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="e.g. Stuck on graphs — DFS/BFS. Final exam in 2 weeks."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <img src={tutor.avatar} alt={tutor.name} className="h-12 w-12 rounded-xl" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{tutor.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{tutor.year} • {tutor.branch}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4 text-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment summary</h3>
                <Row label={selected.name} value={`₹${selected.price.toLocaleString("en-IN")}`} />
                <Row label="Platform fee (5%)" value={`₹${platformFee.toLocaleString("en-IN")}`} />
                {date && time && (
                  <Row label="Session" value={`${days.find(d => d.date === date)?.label} • ${time}`} />
                )}
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-black text-brand">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button type="submit" size="lg" variant="brand" className="mt-5 w-full" disabled={paying}>
                <Lock className="h-4 w-4" /> {paying ? "Processing..." : "Pay & Confirm"}
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">Secured by Razorpay • UPI, cards, netbanking</p>
            </div>
          </aside>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        {Icon && <Icon className="h-4 w-4 text-cyan-glow" />} {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-start justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
