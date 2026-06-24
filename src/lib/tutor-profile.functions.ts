import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

const upsertPackageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  type: z.enum(["Quick Session", "Exam Rescue", "Monthly Plan", "Full Semester"]).default("Quick Session"),
  duration: z.string().default("1 hour"),
  sessions: z.number().int().min(1).default(1),
  price: z.number().int().min(0),
  description: z.string().default(""),
  is_active: z.boolean().default(true),
});

const upsertGradeProofSchema = z.object({
  id: z.string().uuid().optional(),
  subject: z.string().min(1),
  grade: z.string().default(""),
  topics: z.array(z.string()).default([]),
  description: z.string().default(""),
  proof_url: z.string().default(""),
});

const upsertAvailabilitySchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  time_slot: z.string().min(1),
  is_available: z.boolean().default(true),
});

export type Package = Tables<"tutor_packages">;
export type GradeProof = Tables<"grade_proofs">;
export type Availability = Tables<"availability">;

export const getMyPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tutor_packages")
      .select("*")
      .eq("tutor_id", context.userId)
      .order("price", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const upsertPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertPackageSchema.parse(input))
  .handler(async ({ data, context }) => {
    const packageData = {
      ...data,
      tutor_id: context.userId,
    };

    const { data: result, error } = await context.supabase
      .from("tutor_packages")
      .upsert(packageData, { onConflict: "id" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Package ID required");
    return input;
  })
  .handler(async ({ data: packageId, context }) => {
    const { error } = await context.supabase
      .from("tutor_packages")
      .delete()
      .eq("id", packageId)
      .eq("tutor_id", context.userId);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getMyGradeProofs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("grade_proofs")
      .select("*")
      .eq("tutor_id", context.userId);

    if (error) throw new Error(error.message);
    return data || [];
  });

export const upsertGradeProof = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => upsertGradeProofSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase
      .from("grade_proofs")
      .upsert({ ...data, tutor_id: context.userId }, { onConflict: "tutor_id,subject" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  });

export const deleteGradeProof = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Grade proof ID required");
    return input;
  })
  .handler(async ({ data: proofId, context }) => {
    const { error } = await context.supabase
      .from("grade_proofs")
      .delete()
      .eq("id", proofId)
      .eq("tutor_id", context.userId);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getMyAvailability = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("availability")
      .select("*")
      .eq("tutor_id", context.userId)
      .order("day_of_week", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const setAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.array(upsertAvailabilitySchema).parse(input))
  .handler(async ({ data, context }) => {
    await context.supabase.from("availability").delete().eq("tutor_id", context.userId);

    if (data.length === 0) return [];

    const slots = data.map((slot) => ({ ...slot, tutor_id: context.userId }));

    const { data: result, error } = await context.supabase
      .from("availability")
      .insert(slots)
      .select();

    if (error) throw new Error(error.message);
    return result || [];
  });

export const getTutorPackages = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data, error } = await supabaseAdmin
      .from("tutor_packages")
      .select("*")
      .eq("tutor_id", tutorId)
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getTutorGradeProofs = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data, error } = await supabaseAdmin
      .from("grade_proofs")
      .select("*")
      .eq("tutor_id", tutorId);

    if (error) throw new Error(error.message);
    return data || [];
  });
