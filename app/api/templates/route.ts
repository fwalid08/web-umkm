import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllowedTemplateNames } from "@/lib/builder/validation";

// GET /api/templates — daftar template aktif + flag locked per tier (public, gating jika login)
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: templates, error } = await supabase
      .from("templates")
      .select("id, name, description, color_palette, typography_config, sections_config, is_active")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Fetch templates error:", error);
      return NextResponse.json({ success: false, error: "Gagal memuat template" }, { status: 500 });
    }

    const session = await auth().catch(() => null);
    const tier = (session?.user as { tier?: string })?.tier ?? "free";
    const trialEndsAt =
      (session?.user as { trial_ends_at?: string | null })?.trial_ends_at ?? null;
    const names = (templates ?? []).map((t) => t.name as string);
    const allowed = getAllowedTemplateNames(tier, trialEndsAt, names);

    return NextResponse.json({
      success: true,
      data: {
        templates: (templates ?? []).map((t) => ({
          ...t,
          locked: !allowed.includes(t.name as string),
        })),
        tier,
        allowed_templates: allowed,
      },
    });
  } catch (error) {
    console.error("Templates error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
