import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile, upsertMyProfile } from "@/lib/profile.functions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GraduationCap, Loader2, Plus, X, UserRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — Cognitute" }] }),
  component: ProfilePage,
});

type FormState = {
  role: "student" | "tutor";
  full_name: string;
  college: string;
  university: string;
  branch: string;
  year: string;
  cgpa: string;
  roll_no: string;
  phone: string;
  bio: string;
  subjects: string[];
  achievements: string[];
  avatar_url: string;
  hourly_rate: string;
  linkedin: string;
};

const empty: FormState = {
  role: "student",
  full_name: "",
  college: "",
  university: "",
  branch: "",
  year: "",
  cgpa: "",
  roll_no: "",
  phone: "",
  bio: "",
  subjects: [],
  achievements: [],
  avatar_url: "",
  hourly_rate: "",
  linkedin: "",
};

function ProfilePage() {
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(upsertMyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [subjectDraft, setSubjectDraft] = useState("");
  const [achievementDraft, setAchievementDraft] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        setForm({
          role: (p.role as "student" | "tutor") || "student",
          full_name: p.full_name || "",
          college: p.college || "",
          university: p.university || "",
          branch: p.branch || "",
          year: p.year || "",
          cgpa: p.cgpa != null ? String(p.cgpa) : "",
          roll_no: p.roll_no || "",
          phone: p.phone || "",
          bio: p.bio || "",
          subjects: p.subjects || [],
          achievements: p.achievements || [],
          avatar_url: p.avatar_url || "",
          hourly_rate: p.hourly_rate != null ? String(p.hourly_rate) : "",
          linkedin: p.linkedin || "",
        });
      })
      .catch((e) => toast.error(e.message ?? "Couldn't load profile"))
      .finally(() => setLoading(false));
  }, [fetchProfile]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addSubject = () => {
    const v = subjectDraft.trim();
    if (!v || form.subjects.includes(v)) return;
    set("subjects", [...form.subjects, v]);
    setSubjectDraft("");
  };
  const addAchievement = () => {
    const v = achievementDraft.trim();
    if (!v) return;
    set("achievements", [...form.achievements, v]);
    setAchievementDraft("");
  };

  async function handleSave() {
    if (!form.full_name.trim()) {
      toast.error("Please add your full name");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({
        data: {
          role: form.role,
          full_name: form.full_name.trim(),
          college: form.college.trim(),
          university: form.university.trim(),
          branch: form.branch.trim(),
          year: form.year.trim(),
          cgpa: form.cgpa ? Number(form.cgpa) : null,
          roll_no: form.roll_no.trim(),
          phone: form.phone.trim(),
          bio: form.bio.trim(),
          subjects: form.subjects,
          achievements: form.achievements,
          avatar_url: form.avatar_url.trim(),
          hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
          linkedin: form.linkedin.trim(),
        },
      });
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const isTutor = form.role === "tutor";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-soft">
            <UserRound className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              Complete your profile — you can edit any field later.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:max-w-sm">
                  <Label>I am a…</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => set("role", v as "student" | "tutor")}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student (looking for tutors)</SelectItem>
                      <SelectItem value="tutor">Tutor (teach juniors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal info</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *">
                  <Input
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    placeholder="Aarav Sharma"
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
                <Field label="Avatar URL">
                  <Input
                    value={form.avatar_url}
                    onChange={(e) => set("avatar_url", e.target.value)}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="LinkedIn">
                  <Input
                    value={form.linkedin}
                    onChange={(e) => set("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/you"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Short bio">
                    <Textarea
                      rows={3}
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="Tell juniors what makes you a great tutor / what you're studying."
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" /> Academics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="College">
                  <Input
                    value={form.college}
                    onChange={(e) => set("college", e.target.value)}
                    placeholder="IIIT Hyderabad"
                  />
                </Field>
                <Field label="University">
                  <Input
                    value={form.university}
                    onChange={(e) => set("university", e.target.value)}
                    placeholder="JNTU Hyderabad"
                  />
                </Field>
                <Field label="Branch">
                  <Input
                    value={form.branch}
                    onChange={(e) => set("branch", e.target.value)}
                    placeholder="Computer Science"
                  />
                </Field>
                <Field label="Year">
                  <Input
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    placeholder="3rd year / Final year"
                  />
                </Field>
                <Field label="Current CGPA">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={form.cgpa}
                    onChange={(e) => set("cgpa", e.target.value)}
                    placeholder="8.75"
                  />
                </Field>
                <Field label="Roll number">
                  <Input
                    value={form.roll_no}
                    onChange={(e) => set("roll_no", e.target.value)}
                    placeholder="20CSE123"
                  />
                </Field>
              </CardContent>
            </Card>

            {isTutor && (
              <Card>
                <CardHeader>
                  <CardTitle>Tutor details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Field label="Hourly rate (₹)">
                    <Input
                      type="number"
                      min="0"
                      value={form.hourly_rate}
                      onChange={(e) => set("hourly_rate", e.target.value)}
                      placeholder="499"
                      className="sm:max-w-xs"
                    />
                  </Field>

                  <div>
                    <Label className="mb-2 inline-block">Subjects you can teach</Label>
                    <div className="flex gap-2">
                      <Input
                        value={subjectDraft}
                        onChange={(e) => setSubjectDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSubject();
                          }
                        }}
                        placeholder="DSA, Operating Systems…"
                      />
                      <Button type="button" variant="secondary" onClick={addSubject}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.subjects.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1 pr-1">
                          {s}
                          <button
                            type="button"
                            className="ml-1 rounded-full p-0.5 hover:bg-background"
                            onClick={() =>
                              set(
                                "subjects",
                                form.subjects.filter((x) => x !== s),
                              )
                            }
                            aria-label={`Remove ${s}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {form.subjects.length === 0 && (
                        <span className="text-sm text-muted-foreground">No subjects yet.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 inline-block">Achievements</Label>
                    <div className="flex gap-2">
                      <Input
                        value={achievementDraft}
                        onChange={(e) => setAchievementDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAchievement();
                          }
                        }}
                        placeholder="Google Summer of Code 2024"
                      />
                      <Button type="button" variant="secondary" onClick={addAchievement}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {form.achievements.map((a, i) => (
                        <li
                          key={`${a}-${i}`}
                          className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
                        >
                          <span>{a}</span>
                          <button
                            type="button"
                            className="rounded p-1 text-muted-foreground hover:bg-secondary"
                            onClick={() =>
                              set(
                                "achievements",
                                form.achievements.filter((_, idx) => idx !== i),
                              )
                            }
                            aria-label="Remove achievement"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                      {form.achievements.length === 0 && (
                        <li className="text-sm text-muted-foreground">No achievements yet.</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="sticky bottom-4 flex justify-end">
              <Button onClick={handleSave} disabled={saving} variant="brand" size="lg">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save profile
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
