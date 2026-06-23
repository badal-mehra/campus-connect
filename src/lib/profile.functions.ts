import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileInput = z.object({
  role: z.enum(["student", "tutor"]),
  full_name: z.string().trim().min(1, "Name is required").max(100),
  college: z.string().trim().max(150).default(""),
  university: z.string().trim().max(150).default(""),
  branch: z.string().trim().max(80).default(""),
  year: z.string().trim().max(40).default(""),
  cgpa: z
    .union([z.number().min(0).max(10), z.null()])
    .optional()
    .nullable(),
  roll_no: z.string().trim().max(60).default(""),
  phone: z.string().trim().max(30).default(""),
  bio: z.string().max(800).default(""),
  subjects: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  achievements: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
  avatar_url: z.string().trim().max(500).default(""),
  hourly_rate: z
    .union([z.number().int().min(0).max(1_000_000), z.null()])
    .optional()
    .nullable(),
  linkedin: z.string().trim().max(300).default(""),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return data;
    // Auto-create empty profile if missing
    const { data: created, error: insErr } = await context.supabase
      .from("profiles")
      .insert({ id: context.userId })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);
    return created;
  });

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data }, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
