import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

const verifyTutorSchema = z.object({
  tutor_id: z.string().uuid(),
  is_verified: z.boolean(),
});

const updateTutorRoleSchema = z.object({
  tutor_id: z.string().uuid(),
  role: z.enum(["tutor", "admin", "student"]),
});

const updateBookingStatusSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.enum(["Upcoming", "Pending Confirmation", "Completed", "Cancelled"]),
});

export type AdminTutor = Tables<"profiles"> & {
  rating: number;
  total_reviews: number;
  total_bookings: number;
  pending_bookings: number;
};

export type AdminBooking = Tables<"bookings"> & {
  tutor_name: string;
};

export type AdminStats = {
  total_tutors: number;
  verified_tutors: number;
  pending_tutors: number;
  total_students: number;
  total_bookings: number;
  pending_bookings: number;
  completed_sessions: number;
  total_revenue: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireAdmin(context: { userId: string; supabase: any }) {
  const { data: profile } = await context.supabase
    .from("profiles")
    .select("role")
    .eq("id", context.userId)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);

    const [tutorsRes, studentsRes, bookingsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("role, is_verified").eq("role", "tutor"),
      supabaseAdmin.from("profiles").select("role").eq("role", "student"),
      supabaseAdmin.from("bookings").select("status, amount"),
    ]);

    const tutors = tutorsRes.data || [];
    const students = studentsRes.data || [];
    const bookings = bookingsRes.data || [];

    const completedBookings = bookings.filter(b => b.status === "Completed");
    const pendingBookings = bookings.filter(b => b.status === "Pending Confirmation");

    return {
      total_tutors: tutors.length,
      verified_tutors: tutors.filter(t => t.is_verified).length,
      pending_tutors: tutors.filter(t => !t.is_verified).length,
      total_students: students.length,
      total_bookings: bookings.length,
      pending_bookings: pendingBookings.length,
      completed_sessions: completedBookings.length,
      total_revenue: completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
    } as AdminStats;
  });

export const getAllTutorsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);

    const { data: tutors, error } = await supabaseAdmin
      .from("profiles")
      .select(`
        *,
        reviews:tutor_id(count),
        bookings:tutor_id(count)
      `)
      .in("role", ["tutor", "admin"])
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const { data: reviewsData } = await supabaseAdmin
      .from("reviews")
      .select("tutor_id, rating");

    const { data: pendingBookings } = await supabaseAdmin
      .from("bookings")
      .select("tutor_id")
      .eq("status", "Pending Confirmation");

    const reviewCounts: Record<string, { total: number; sum: number }> = {};
    reviewsData?.forEach(r => {
      if (!reviewCounts[r.tutor_id]) reviewCounts[r.tutor_id] = { total: 0, sum: 0 };
      reviewCounts[r.tutor_id].total++;
      reviewCounts[r.tutor_id].sum += r.rating;
    });

    const pendingCounts: Record<string, number> = {};
    pendingBookings?.forEach(b => {
      pendingCounts[b.tutor_id] = (pendingCounts[b.tutor_id] || 0) + 1;
    });

    return (tutors || []).map(t => {
      const r = reviewCounts[t.id] || { total: 0, sum: 0 };
      return {
        ...t,
        rating: r.total > 0 ? Math.round((r.sum / r.total) * 10) / 10 : 0,
        total_reviews: r.total,
        total_bookings: (t as unknown as { bookings?: { count: number }[] }).bookings?.[0]?.count || 0,
        pending_bookings: pendingCounts[t.id] || 0,
      } as AdminTutor;
    });
  });

export const verifyTutor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => verifyTutorSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_verified: data.is_verified })
      .eq("id", data.tutor_id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const updateTutorRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTutorRoleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role: data.role })
      .eq("id", data.tutor_id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getAllBookingsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);

    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select(`
        *,
        tutor:profiles!bookings_tutor_id_fkey(full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (bookings || []).map(b => ({
      ...b,
      tutor_name: (b.tutor as unknown as { full_name: string })?.full_name || "Unknown",
    })) as AdminBooking[];
  });

export const adminUpdateBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateBookingStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.booking_id);

    if (error) throw new Error(error.message);

    if (data.status === "Completed") {
      const { data: booking } = await supabaseAdmin
        .from("bookings")
        .select("tutor_id")
        .eq("id", data.booking_id)
        .maybeSingle();

      if (booking?.tutor_id) {
        await supabaseAdmin.rpc("recalculate_tutor_stats", { p_tutor_id: booking.tutor_id });
      }
    }

    return { success: true };
  });

export const getPayoutSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);

    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select("tutor_id, amount, status, tutor:profiles!bookings_tutor_id_fkey(full_name)")
      .eq("status", "Completed");

    if (error) throw new Error(error.message);

    const payouts: Record<string, { tutor_id: string; tutor_name: string; total_earnings: number; session_count: number }> = {};

    bookings?.forEach(b => {
      const tid = b.tutor_id;
      if (!payouts[tid]) {
        payouts[tid] = {
          tutor_id: tid,
          tutor_name: (b.tutor as unknown as { full_name: string })?.full_name || "Unknown",
          total_earnings: 0,
          session_count: 0,
        };
      }
      payouts[tid].total_earnings += b.amount || 0;
      payouts[tid].session_count++;
    });

    return Object.values(payouts).sort((a, b) => b.total_earnings - a.total_earnings);
  });
