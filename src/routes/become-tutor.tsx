import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/become-tutor")({
  head: () => ({
    meta: [
      { title: "Become a Tutor — Cognitute" },
      { name: "description", content: "Teach juniors, earn on your terms. Apply to become a verified Cognitute tutor." },
      { property: "og:title", content: "Become a Tutor — Cognitute" },
      { property: "og:description", content: "Teach juniors, earn on your terms." },
    ],
  }),
  component: BecomeTutor,
});

const STEPS = ["Basic Info", "Academic Info", "Teaching Preferences", "Payment"];

function BecomeTutor() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) { next(); return; }
    toast.success("Application submitted! We'll review within 24 hours.");
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-brand-foreground shadow-elegant">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl font-black tracking-tight">You're in the review queue</h1>
          <p className="mt-3 text-muted-foreground">Your profile will be reviewed in 24 hours. We'll email you once you're live on Cognitute.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero py-12 text-brand-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Monetize Your Mastery.</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/75">Stop giving free advice in the library. Turn your late-night grinds and top grades into serious cash by coaching the next wave of juniors who need it most.</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ProgressBar step={step} />

        <form onSubmit={submit} className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {step === 0 && <BasicInfo />}
          {step === 1 && <AcademicInfo />}
          {step === 2 && <TeachingPrefs />}
          {step === 3 && <PaymentInfo />}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button type="button" variant="ghost" onClick={prev} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="submit" variant="brand" size="lg">
              {step === STEPS.length - 1 ? "Submit application" : <>Continue <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex flex-col items-center gap-2 ${i <= step ? "text-brand" : "text-muted-foreground"}`}>
            <span className={`grid h-8 w-8 place-items-center rounded-full text-xs ${i < step ? "bg-gradient-brand text-brand-foreground" : i === step ? "bg-brand text-brand-foreground" : "border border-border bg-card"}`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span className="hidden text-center sm:block">{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gradient-brand transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function BasicInfo() {
  return (
    <div className="space-y-5">
      <StepHeader title="Tell us about you" subtitle="The basics — we'll keep your contact info private." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name"><Input placeholder="Aarav Sharma" required /></Field>
        <Field label="College / University"><Input placeholder="Lovely Professional University" required /></Field>
        <Field label="Year"><Input placeholder="3rd Year" required /></Field>
        <Field label="Branch"><Input placeholder="CSE" required /></Field>
        <Field label="Phone"><Input type="tel" placeholder="+91 91035 7988" required /></Field>
        <Field label="College Email"><Input type="email" placeholder="you@lpu.in" required /></Field>
      </div>
    </div>
  );
}

function AcademicInfo() {
  return (
    <div className="space-y-5">
      <StepHeader title="Academic credentials" subtitle="Verified grades = trust + better pricing." />
      <Field label="Subjects you can teach" hint="Comma separated — DSA, DBMS, Operating Systems">
        <Input placeholder="DSA, DBMS, OS" required />
      </Field>
      <Field label="Grade proof (transcript / report card)" hint="PDF or image, max 5MB">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-cyan-glow hover:bg-secondary/60">
          <Upload className="h-4 w-4" /> Click to upload your transcript
          <input type="file" className="hidden" />
        </label>
      </Field>
      <Field label="Achievements (optional)" hint="GATE rank, hackathons, internships, publications…">
        <Textarea placeholder="GSoC 2024 contributor, Smart India Hackathon winner..." rows={3} />
      </Field>
    </div>
  );
}

function TeachingPrefs() {
  const pkgs = ["Quick Session (1 hour)", "Exam Rescue (2 weeks)", "Monthly Plan (12 sessions)", "Full Semester"];
  return (
    <div className="space-y-5">
      <StepHeader title="How you want to teach" subtitle="Pick your packages and set your price." />
      <Field label="Packages you'll offer">
        <div className="grid gap-2 sm:grid-cols-2">
          {pkgs.map((p) => (
            <label key={p} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm hover:border-cyan-glow">
              <Checkbox defaultChecked />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Starting price per hour (₹)"><Input type="number" placeholder="299" required /></Field>
        <Field label="Weekly availability"><Input placeholder="Weekdays 7-10 PM" required /></Field>
      </div>
      <Field label="Teaching mode">
        <div className="grid gap-2 sm:grid-cols-3">
          {["Online", "Offline", "Both"].map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm hover:border-cyan-glow">
              <Checkbox /> <span>{m}</span>
            </label>
          ))}
        </div>
      </Field>
    </div>
  );
}

function PaymentInfo() {
  return (
    <div className="space-y-5">
      <StepHeader title="Get paid" subtitle="UPI payouts within 48 hours after each session." />
      <Field label="UPI ID" hint="e.g. yourname@oksbi"><Input placeholder="aarav@oksbi" required /></Field>
      <Field label="Account holder name"><Input placeholder="Aarav Sharma" required /></Field>
      <div className="rounded-xl border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
        By submitting, you agree to Cognitute's Tutor Code of Conduct and consent to grade verification.
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
