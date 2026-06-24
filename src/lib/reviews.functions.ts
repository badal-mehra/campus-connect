import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

const createReviewSchema = z.object({
  tutor_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().default(""),
});

const updateReviewSchema = z.object({
  review_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type Review = Tables<"reviews">;

export const createReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createReviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name")
      .eq("id", context.userId)
      .maybeSingle();

    const { data: review, error } = await context.supabase
      .from("reviews")
      .insert({
        tutor_id: data.tutor_id,
        student_id: context.userId,
        student_name: profile?.full_name || "Anonymous",
        rating: data.rating,
        comment: data.comment,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return review;
  });

export const updateReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateReviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("reviews")
      .select("student_id")
      .eq("id", data.review_id)
      .maybeSingle();

    if (!existing) throw new Error("Review not found");
    if (existing.student_id !== context.userId) throw new Error("Not authorized");

    const updateData: Record<string, unknown> = {};
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;

    const { data: review, error } = await context.supabase
      .from("reviews")
      .update(updateData)
      .eq("id", data.review_id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return review;
  });

export const getReviewsForTutor = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("tutor_id", tutorId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getReviewStats = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("rating")
      .eq("tutor_id", tutorId);

    if (error) throw new Error(error.message);

    const reviews = data || [];
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[r.rating as keyof typeof breakdown]++;
      }
    });

    return {
      total_reviews: totalReviews,
      avg_rating: Math.round(avgRating * 10) / 10,
      breakdown,
    };
  });
