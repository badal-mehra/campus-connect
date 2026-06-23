import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const packageInput = z.object({
  name: z.string().min(2).max(80),
  type: z.enum(["Quick Session", "Exam Rescue", "Monthly Plan", "Full Semester"]),
  duration: z.string().min(1).max(40),
  sessions: z.number().int().min(1).max(200),
  price: z.number().int().min(0).max(1_000_000),
  description: z.string().max(500).default(""),
  is_active: z.boolean().default(true),
});

export const listMyPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tutor_packages")
      .select("*")
      .eq("tutor_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => packageInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("tutor_packages")
      .insert({ ...data, tutor_id: context.userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updatePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    packageInput.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("tutor_packages")
      .update(patch)
      .eq("id", id)
      .eq("tutor_id", context.userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("tutor_packages")
      .delete()
      .eq("id", data.id)
      .eq("tutor_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
