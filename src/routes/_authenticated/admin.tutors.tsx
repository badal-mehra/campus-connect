import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAllTutorsAdmin, verifyTutor, type AdminTutor } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, Check, X, Star, ExternalLink, Loader as Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/tutors")({
  head: () => ({ meta: [{ title: "Manage Tutors — Cognitute Admin" }] }),
  component: AdminTutors,
});

function AdminTutors() {
  const fetchTutors = useServerFn(getAllTutorsAdmin);
  const verify = useServerFn(verifyTutor);

  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchTutors()
      .then(setTutors)
      .catch((e) => console.error("Failed to load tutors:", e))
      .finally(() => setLoading(false));
  }, [fetchTutors]);

  const handleVerify = async (tutorId: string, isVerified: boolean) => {
    setProcessing(tutorId);
    try {
      await verify({ data: { tutor_id: tutorId, is_verified: isVerified } });
      setTutors((ts) =>
        ts.map((t) => (t.id === tutorId ? { ...t, is_verified: isVerified } : t))
      );
      toast.success(isVerified ? "Tutor verified" : "Tutor unverified");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = tutors.filter((t) => {
    const q = query.toLowerCase();
    if (query) {
      const matchesName = t.full_name?.toLowerCase().includes(q);
      const matchesEmail = t.college?.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail) return false;
    }
    if (filter === "verified" && !t.is_verified) return false;
    if (filter === "pending" && t.is_verified) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or college..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "pending", "verified"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "brand" : "brandOutline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Tutor</th>
                <th className="px-4 py-3 font-medium">Year/College</th>
                <th className="px-4 py-3 font-medium">Subjects</th>
                <th className="px-4 py-3 font-medium text-center">Rating</th>
                <th className="px-4 py-3 font-medium text-center">Bookings</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No tutors found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(t.full_name || "User")}`}
                          alt={t.full_name || "Tutor"}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div>
                          <p className="font-semibold">{t.full_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p>{t.year || "-"}</p>
                      <p className="text-xs text-muted-foreground">{t.college || "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(t.subjects || []).slice(0, 2).map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {(t.subjects?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">+{t.subjects!.length - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{t.rating || 0}</span>
                        <span className="text-muted-foreground">({t.total_reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium">{t.total_bookings}</span>
                      {t.pending_bookings > 0 && (
                        <span className="ml-1 text-xs text-muted-foreground">({t.pending_bookings} pending)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.is_verified ? (
                        <Badge variant="default" className="bg-emerald-500">Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-500 text-white">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to="/tutors/$id"
                          params={{ id: t.id }}
                          className="rounded p-2 hover:bg-secondary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        {t.is_verified ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerify(t.id, false)}
                            disabled={processing === t.id}
                          >
                            {processing === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                          </Button>
                        ) : (
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() => handleVerify(t.id, true)}
                            disabled={processing === t.id}
                          >
                            {processing === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
