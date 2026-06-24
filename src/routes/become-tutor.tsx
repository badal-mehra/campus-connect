import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload, ArrowRight, ArrowLeft, BookOpen, Clock, Calendar, Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const STEPS = [
  { id: "basic", title: "Basic Info", description: "Who are you?" },
  { id: "academic", title: "Academic Info", description: "Verify your expertise" },
  { id: "preferences", title: "Preferences", description: "How you want to teach" },
  { id: "payment", title: "Payment", description: "Where to send the money" }
];

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
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-primary mb-6">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4">Application Received!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your profile is currently in the review queue. We usually process these within 24 hours. Keep an eye on your email!
            </p>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 lg:py-12">
          
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col lg:flex-row min-h-[700px]">
            {/* Left Sidebar - Progress & Motivation */}
            <div className="bg-primary/5 border-b lg:border-b-0 lg:border-r border-border p-8 lg:w-1/3 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Monetize Your Mastery</h2>
                <p className="text-muted-foreground mb-10 text-sm">
                  Turn your late-night grinds and top grades into serious cash by coaching the next wave of juniors.
                </p>

                <div className="space-y-6">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-start gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                        i < step ? "bg-primary border-primary text-primary-foreground" : 
                        i === step ? "border-primary text-primary" : 
                        "border-muted text-muted-foreground"
                      }`}>
                        {i < step ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-semibold">{i + 1}</span>}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                          {s.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{s.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block mt-12 p-4 rounded-2xl bg-background/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-sm">Pro Tip</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete profiles with verifiable grades get approved 3x faster and attract more students.
                </p>
              </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="flex-1 p-6 sm:p-10 lg:p-12 relative flex flex-col">
              <form onSubmit={submit} className="flex-1 flex flex-col">
                
                {/* Form Content with smooth entering animation */}
                <div className="flex-1 animate-in slide-in-from-right-4 fade-in duration-500" key={step}>
                  {step === 0 && <BasicInfo />}
                  {step === 1 && <AcademicInfo />}
                  {step === 2 && <TeachingPrefs />}
                  {step === 3 && <PaymentInfo />}
                </div>

                {/* Form Navigation Controls */}
                <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={prev} 
                    className={step === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  
                  <Button type="submit" size="lg" className="min-w-[140px]">
                    {step === STEPS.length - 1 ? "Submit Application" : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// --- Form Step Components ---

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function BasicInfo() {
  const years = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

  return (
    <div className="space-y-6">
      <StepHeader title="Tell us about you" subtitle="The basics — we'll keep your personal contact info private." />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name"><Input placeholder="Badal Mehra" className="h-11" required /></Field>
        <Field label="Phone"><Input type="tel" placeholder="+91 98765 43210" className="h-11" required /></Field>
        <div className="sm:col-span-2">
          <Field label="College / University"><Input placeholder="Lovely Professional University" className="h-11" required /></Field>
        </div>
        
        <Field label="Current Year">
          <Select required>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select your year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toLowerCase().replace(" ", "-")}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Branch"><Input placeholder="CSE" className="h-11" required /></Field>
        
        <div className="sm:col-span-2">
          <Field label="College Email" hint="Use your .edu or institutional email for faster verification.">
            <Input type="email" placeholder="badal@lpu.in" className="h-11" required />
          </Field>
        </div>
      </div>
    </div>
  );
}

function AcademicInfo() {
  return (
    <div className="space-y-6">
      <StepHeader title="Academic credentials" subtitle="Verified grades build trust and allow you to charge premium rates." />
      
      <Field label="Core Subjects You Can Teach" hint="E.g., Data Structures, Operating Systems, React">
        <Input placeholder="DSA, Web Development, OS" className="h-11" required />
      </Field>
      
      <Field label="Upload Transcript / Grade Proof">
        <div className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-secondary/20 px-6 py-10 transition-all hover:border-primary/50 hover:bg-primary/5">
          <div className="rounded-full bg-background p-3 shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, or JPG (max. 5MB)</p>
          </div>
          <input type="file" className="absolute inset-0 cursor-pointer opacity-0" required />
        </div>
      </Field>

      <Field label="Notable Achievements (Optional)" hint="Hackathon wins, internships, high ranks, etc.">
        <Textarea placeholder="Built an internal campus tool used by 500+ students..." className="min-h-[100px] resize-none" />
      </Field>
    </div>
  );
}

function TeachingPrefs() {
  const pkgs = [
    { id: "quick", title: "Quick Session", desc: "1 hour doubt clearing", icon: Zap },
    { id: "exam", title: "Exam Rescue", desc: "2 weeks intensive", icon: BookOpen },
    { id: "monthly", title: "Monthly Plan", desc: "12 detailed sessions", icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <StepHeader title="Set your terms" subtitle="Decide how you want to teach and what you want to charge." />
      
      <Field label="Select Packages You'll Offer">
        <div className="grid gap-4 sm:grid-cols-3">
          {pkgs.map((p) => (
            <label key={p.id} className="relative flex cursor-pointer flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
              <Checkbox className="absolute right-4 top-4" />
              <p.icon className="mb-3 h-6 w-6 text-muted-foreground" />
              <span className="font-semibold text-sm">{p.title}</span>
              <span className="text-xs text-muted-foreground mt-1">{p.desc}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Hourly Rate (₹)" hint="You can adjust this later.">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input type="number" placeholder="299" className="h-11 pl-8" required />
          </div>
        </Field>
        <Field label="Weekly Availability" hint="When are you free?">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Weekdays 7-10 PM" className="h-11 pl-9" required />
          </div>
        </Field>
      </div>

      <Field label="Teaching Mode">
        <div className="flex gap-4">
          {["Online", "Offline", "Hybrid"].map((m) => (
            <label key={m} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm transition-all hover:bg-secondary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
              <input type="radio" name="mode" className="sr-only" defaultChecked={m === "Online"} /> 
              <span className="font-medium">{m}</span>
            </label>
          ))}
        </div>
      </Field>
    </div>
  );
}

function PaymentInfo() {
  return (
    <div className="space-y-6">
      <StepHeader title="Get paid easily" subtitle="We process payouts directly to your UPI within 48 hours of session completion." />
      
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Account Holder Name"><Input placeholder="Badal Mehra" className="h-11 bg-background" required /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="UPI ID" hint="Please ensure this UPI ID is active and accepts payments.">
              <Input placeholder="username@upi" className="h-11 bg-background" required />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          By clicking Submit Application, you agree to Cognitute's Tutor Code of Conduct and Terms of Service. 
          You also consent to our team securely verifying your academic credentials. Your financial details are encrypted and stored securely.
        </p>
      </div>
    </div>
  );
}
