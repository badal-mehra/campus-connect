import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export type TutorProfile = Tables<"profiles"> & {
  packages: Tables<"tutor_packages">[];
  reviews: Tables<"reviews">[];
  grade_proofs: Tables<"grade_proofs">[];
  availability: Tables<"availability">[];
  rating: number;
  rating_breakdown: { 1: number; 2: number; 3: number; 4: number; 5: number };
};

export type TutorListItem = Tables<"profiles"> & {
  rating: number;
  review_count: number;
  starting_price: number;
};

export const getAllTutors = createServerFn({ method: "GET" }).handler(async () => {
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("role", "tutor")
    .order("created_at", { ascending: false });

  if (profilesError) throw new Error(profilesError.message);

  const tutorsWithStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const [reviewsResult, packagesResult] = await Promise.all([
        supabaseAdmin.from("reviews").select("rating").eq("tutor_id", profile.id),
        supabaseAdmin.from("tutor_packages").select("price").eq("tutor_id", profile.id).eq("is_active", true).order("price", { ascending: true }).limit(1),
      ]);

      const reviews = reviewsResult.data || [];
      const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      const startingPrice = packagesResult.data?.[0]?.price || profile.hourly_rate || 0;

      return {
        ...profile,
        rating: Math.round(rating * 10) / 10,
        review_count: reviews.length,
        starting_price: startingPrice,
      } as TutorListItem;
    })
  );

  return tutorsWithStats;
});

export const getTutorById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID is required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", tutorId)
      .eq("role", "tutor")
      .maybeSingle();

    if (profileError) throw new Error(profileError.message);
    if (!profile) return null;

    const [packagesResult, reviewsResult, gradeProofsResult, availabilityResult] = await Promise.all([
      supabaseAdmin.from("tutor_packages").select("*").eq("tutor_id", tutorId).eq("is_active", true).order("price", { ascending: true }),
      supabaseAdmin.from("reviews").select("*").eq("tutor_id", tutorId).order("created_at", { ascending: false }),
      supabaseAdmin.from("grade_proofs").select("*").eq("tutor_id", tutorId),
      supabaseAdmin.from("availability").select("*").eq("tutor_id", tutorId).order("day_of_week", { ascending: true }),
    ]);

    const reviews = reviewsResult.data || [];
    const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingBreakdown[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    const tutor: TutorProfile = {
      ...profile,
      packages: packagesResult.data || [],
      reviews: reviews,
      grade_proofs: gradeProofsResult.data || [],
      availability: availabilityResult.data || [],
      rating: Math.round(rating * 10) / 10,
      rating_breakdown: ratingBreakdown,
    };

    return tutor;
  });

export const getFeaturedTutors = createServerFn({ method: "GET" }).handler(async () => {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("role", "tutor")
    .order("total_sessions", { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);

  const tutorsWithStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const [reviewsResult, packagesResult] = await Promise.all([
        supabaseAdmin.from("reviews").select("rating").eq("tutor_id", profile.id),
        supabaseAdmin.from("tutor_packages").select("price").eq("tutor_id", profile.id).eq("is_active", true).order("price", { ascending: true }).limit(1),
      ]);

      const reviews = reviewsResult.data || [];
      const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      const startingPrice = packagesResult.data?.[0]?.price || profile.hourly_rate || 0;

      return {
        ...profile,
        rating: Math.round(rating * 10) / 10,
        review_count: reviews.length,
        starting_price: startingPrice,
      } as TutorListItem;
    })
  );

  return tutorsWithStats;
});

export const getAllSubjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("profiles").select("subjects").eq("role", "tutor").not("subjects", "eq", "{}");

  if (error) throw new Error(error.message);

  const allSubjects = new Set<string>();
  data?.forEach((profile) => {
    profile.subjects?.forEach((s) => {
      if (s.trim()) allSubjects.add(s.trim());
    });
  });

  return Array.from(allSubjects).sort();
});

export const searchTutors = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "object" || input === null) {
      throw new Error("Search params required");
    }
    return input as {
      query?: string;
      subjects?: string[];
      minPrice?: number;
      maxPrice?: number;
      badge?: string;
      year?: string;
      mode?: string;
    };
  })
  .handler(async ({ data: params }) => {
    let query = supabaseAdmin.from("profiles").select("*").eq("role", "tutor");

    const { data: profiles, error } = await query;
    if (error) throw new Error(error.message);

    let filtered = profiles || [];

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(q) ||
          p.subjects?.some((s) => s.toLowerCase().includes(q)) ||
          p.college?.toLowerCase().includes(q)
      );
    }

    if (params.subjects?.length) {
      filtered = filtered.filter((p) => params.subjects!.some((s) => p.subjects?.includes(s)));
    }

    if (params.badge) {
      filtered = filtered.filter((p) => p.badge === params.badge);
    }

    if (params.year) {
      filtered = filtered.filter((p) => p.year === params.year);
    }

    if (params.mode) {
      filtered = filtered.filter((p) => p.mode === params.mode || p.mode === "Both");
    }

    const tutorsWithStats = await Promise.all(
      filtered.map(async (profile) => {
        const [reviewsResult, packagesResult] = await Promise.all([
          supabaseAdmin.from("reviews").select("rating").eq("tutor_id", profile.id),
          supabaseAdmin.from("tutor_packages").select("price").eq("tutor_id", profile.id).eq("is_active", true).order("price", { ascending: true }).limit(1),
        ]);

        const reviews = reviewsResult.data || [];
        const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        const startingPrice = packagesResult.data?.[0]?.price || profile.hourly_rate || 0;

        if (params.minPrice !== undefined && startingPrice < params.minPrice) return null;
        if (params.maxPrice !== undefined && startingPrice > params.maxPrice) return null;

        return {
          ...profile,
          rating: Math.round(rating * 10) / 10,
          review_count: reviews.length,
          starting_price: startingPrice,
        } as TutorListItem;
      })
    );

    return tutorsWithStats.filter((t): t is TutorListItem => t !== null);
  });

export const getTutorBookings = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("tutor_id", tutorId)
      .order("session_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getTutorReviews = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("tutor_id", tutorId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  });

export const getTutorAvailability = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Tutor ID required");
    return input;
  })
  .handler(async ({ data: tutorId }) => {
    const { data, error } = await supabaseAdmin
      .from("availability")
      .select("*")
      .eq("tutor_id", tutorId)
      .eq("is_available", true)
      .order("day_of_week", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  });
