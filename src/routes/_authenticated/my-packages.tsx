import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  createPackage, deletePackage, listMyPackages, updatePackage,
} from "@/lib/packages.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, IndianRupee, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-packages")({
  head: () => ({ meta: [{ title: "My Packages — Cognitute" }] }),
  component: MyPackagesPage,
});

type Pkg = {
  id: string;
  tutor_id: string;
  name: string;
  type: string;
  duration: string;
  sessions: number;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
};

const TYPES = ["Quick Session", "Exam Rescue", "Monthly Plan", "Full Semester"] as const;

const EMPTY: PkgForm = {
  name: "", type: "Quick Session", duration: "1 hour",
  sessions: 1, price: 299, description: "", is_active: true,
};

type PkgForm = {
  name: string;
  type: typeof TYPES[number];
  duration: string;
  sessions: number;
  price: number;
  description: string;
  is_active: boolean;
};

function MyPackagesPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listMyPackages);
  const createFn = useServerFn(createPackage);
  const updateFn = useServerFn(updatePackage);
  const deleteFn = useServerFn(deletePackage);

  const [editing, setEditing] = useState<Pkg | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PkgForm>(EMPTY);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["my-packages"],
    queryFn: () => listFn() as Promise<Pkg[]>,
  });

  const saveMut = useMutation({
    mutationFn: async (values: PkgForm) => {
      if (editing) return updateFn({ data: { id: editing.id, ...values } });
      return createFn({ data: values });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-packages"] });
      toast.success(editing ? "Package updated" : "Package created");
      setOpen(false); setEditing(null); setForm(EMPTY);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-packages"] });
      toast.success("Package deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActiveMut = useMutation({
    mutationFn: (pkg: Pkg) =>
      updateFn({ data: {
        id: pkg.id, name: pkg.name,
        type: pkg.type as PkgForm["type"], duration: pkg.duration,
        sessions: pkg.sessions, price: pkg.price,
        description: pkg.description, is_active: !pkg.is_active,
      } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-packages"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: Pkg) {
    setEditing(p);
    setForm({
      name: p.name, type: (TYPES as readonly string[]).includes(p.type) ? (p.type as PkgForm["type"]) : "Quick Session",
      duration: p.duration, sessions: p.sessions, price: p.price,
      description: p.description, is_active: p.is_active,
    });
    setOpen(true);
  }

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  const activeCount = packages.filter((p) => p.is_active).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-gradient-hero text-brand-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Tutor workspace</p>
            <h1 className="text-3xl font-black tracking-tight">My Packages</h1>
            <p className="mt-1 text-sm text-white/70">
              {packages.length} package{packages.length === 1 ? "" : "s"} · {activeCount} live for students
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="hero" size="lg" onClick={openNew}>
              <Plus className="h-4 w-4" /> New package
            </Button>
            <Button variant="brandOutline" size="lg" onClick={signOut} className="bg-white/5 text-white hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : packages.length === 0 ? (
          <EmptyState onCreate={openNew} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((p) => (
              <div key={p.id} className={`rounded-2xl border bg-card p-5 transition-colors ${p.is_active ? "border-border" : "border-dashed border-muted-foreground/40 opacity-70"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">{p.type}</span>
                    <h3 className="mt-2 truncate text-base font-bold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.duration} • {p.sessions} session{p.sessions > 1 ? "s" : ""}</p>
                  </div>
                  <p className="shrink-0 text-lg font-black text-brand">₹{p.price.toLocaleString("en-IN")}</p>
                </div>
                {p.description && <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{p.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <Switch checked={p.is_active} onCheckedChange={() => toggleActiveMut.mutate(p)} />
                    {p.is_active ? "Live" : "Hidden"}
                  </label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      if (confirm(`Delete "${p.name}"? Students won't be able to book this.`)) delMut.mutate(p.id);
                    }}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogTrigger asChild><span /></DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit package" : "Create package"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); saveMut.mutate(form); }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Package name</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Quick Doubt Clearing" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v: PkgForm["type"]) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 hour" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Sessions</Label>
                <Input type="number" min={1} required value={form.sessions}
                  onChange={(e) => setForm({ ...form, sessions: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" min={0} required className="pl-8" value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What students get in this package..." />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              Live for students
            </label>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="brand" disabled={saveMut.isPending}>
                {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save changes" : "Create package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <h2 className="text-lg font-bold">No packages yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">Create your first package — students will be able to book it instantly.</p>
      <Button variant="brand" className="mt-5" onClick={onCreate}><Plus className="h-4 w-4" /> Create first package</Button>
    </div>
  );
}
