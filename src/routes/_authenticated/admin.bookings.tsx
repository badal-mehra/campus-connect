import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAllBookingsAdmin, adminUpdateBooking, type AdminBooking } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, Check, X, Loader as Loader2, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  head: () => ({ meta: [{ title: "Manage Bookings — Cognitute Admin" }] }),
  component: AdminBookings,
});

const statusColors: Record<string, string> = {
  "Pending Confirmation": "bg-amber-500 text-white",
  "Upcoming": "bg-blue-500 text-white",
  "Completed": "bg-emerald-500 text-white",
  "Cancelled": "bg-red-500 text-white",
};

function AdminBookings() {
  const fetchBookings = useServerFn(getAllBookingsAdmin);
  const updateStatus = useServerFn(adminUpdateBooking);

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((e) => console.error("Failed to load bookings:", e))
      .finally(() => setLoading(false));
  }, [fetchBookings]);

  const handleStatus = async (bookingId: string, status: "Completed" | "Cancelled") => {
    setProcessing(bookingId);
    try {
      await updateStatus({ data: { booking_id: bookingId, status } });
      setBookings((bs) =>
        bs.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast.success(`Booking marked as ${status}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase();
    if (query) {
      const matchesStudent = b.student_name?.toLowerCase().includes(q);
      const matchesTutor = b.tutor_name?.toLowerCase().includes(q);
      const matchesSubject = b.subject?.toLowerCase().includes(q);
      if (!matchesStudent && !matchesTutor && !matchesSubject) return false;
    }
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
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
            placeholder="Search by student, tutor or subject..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "brand" : "brandOutline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          {["Pending Confirmation", "Upcoming", "Completed", "Cancelled"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "brand" : "brandOutline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Tutor</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Date/Time</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.student_name || "Anonymous"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{b.tutor_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{b.subject || "General"}</Badge>
                      {b.package_name && (
                        <p className="text-xs text-muted-foreground mt-1">{b.package_name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p>{b.session_date}</p>
                          <p className="text-xs text-muted-foreground">{b.session_time || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">Rs. {b.amount?.toLocaleString() || 0}</p>
                      <p className="text-xs text-muted-foreground">{b.mode}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[b.status] || ""}>{b.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {b.status !== "Completed" && b.status !== "Cancelled" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatus(b.id, "Completed")}
                              disabled={processing === b.id}
                              title="Mark as Completed"
                            >
                              {processing === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-emerald-500" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatus(b.id, "Cancelled")}
                              disabled={processing === b.id}
                              title="Cancel"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        {(b.status === "Completed" || b.status === "Cancelled") && (
                          <span className="text-xs text-muted-foreground">-</span>
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
