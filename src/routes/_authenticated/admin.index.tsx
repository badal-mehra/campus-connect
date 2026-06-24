import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminStats } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, Calendar, Clock, CircleCheck as CheckCircle, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Cognitute" }] }),
  component: AdminDashboard,
});

type Stats = Awaited<ReturnType<typeof getAdminStats>>;

function StatCard({ title, value, icon: Icon, description }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const fetchStats = useServerFn(getAdminStats);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((e) => console.error("Failed to load stats:", e))
      .finally(() => setLoading(false));
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-muted-foreground">Failed to load dashboard.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tutors" value={stats.total_tutors} icon={GraduationCap} />
        <StatCard title="Verified Tutors" value={stats.verified_tutors} icon={Users} />
        <StatCard title="Pending Verification" value={stats.pending_tutors} icon={Clock} />
        <StatCard title="Total Students" value={stats.total_students} icon={Users} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={stats.total_bookings} icon={Calendar} />
        <StatCard title="Pending Bookings" value={stats.pending_bookings} icon={Clock} />
        <StatCard title="Completed Sessions" value={stats.completed_sessions} icon={CheckCircle} />
        <StatCard title="Total Revenue" value={`Rs. ${stats.total_revenue.toLocaleString()}`} icon={IndianRupee} />
      </div>
    </div>
  );
}
