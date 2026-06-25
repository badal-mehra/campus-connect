import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

const createBookingSchema = z.object({
  tutor_id: z.string().uuid(),
  subject: z.string().min(1),
  package_id: z.string().uuid().optional(),
  package_name: z.string().default(""),
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  session_time: z.string().min(1),
  mode: z.enum(["Online", "Offline", "Hybrid"]).default("Online"),
  amount: z.number().int().min(0).default(0),
  notes: z.string().default(""),
});

const updateBookingSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.enum(["Upcoming", "Pending Confirmation", "Completed", "Cancelled"]).optional(),
  notes: z.string().optional(),
});

export type Booking = Tables<"bookings">;

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createBookingSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name")
      .eq("id", context.userId)
      .maybeSingle();

    const { data: booking, error } = await context.supabase
      .from("bookings")
      .insert({
        tutor_id: data.tutor_id,
        student_id: context.userId,
        student_name: profile?.full_name || "Anonymous",
        subject: data.subject,
        package_id: data.package_id,
        package_name: data.package_name,
        session_date: data.session_date,
        session_time: data.session_time,
        mode: data.mode,
        amount: data.amount,
        notes: data.notes,
        status: "Pending Confirmation",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return booking;
  });

export const updateBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateBookingSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("bookings")
      .select("tutor_id")
      .eq("id", data.booking_id)
      .maybeSingle();

    if (!existing) throw new Error("Booking not found");
    if (existing.tutor_id !== context.userId) throw new Error("Not authorized");

    const updateData: { status?: string; notes?: string } = {};
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: booking, error } = await context.supabase
      .from("bookings")
      .update(updateData)
      .eq("id", data.booking_id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (data.status === "Completed") {
      await context.supabase.rpc("recalculate_tutor_stats", { p_tutor_id: existing.tutor_id });
    }

    return booking;
  });

export const getMyBookingsAsStudent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .eq("student_id", context.userId)
      .order("session_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getMyBookingsAsTutor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .eq("tutor_id", context.userId)
      .order("session_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getBookingById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Booking ID required");
    return input;
  })
  .handler(async ({ data: bookingId }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  });
