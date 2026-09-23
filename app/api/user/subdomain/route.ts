import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { subdomainSchema } from "@/types";

// GET /api/user/subdomain
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const supabase = await createServerSupabaseClient();
    const { data: user, error } = await supabase.from("users").select("subdomain, custom_domain, custom_domain_verified, custom_domain_verified_at, trial_ends_at").eq("id", (session.user as any).id).single();
    if (error || !user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      data: {
        has_subdomain: !!user.subdomain,
        subdomain: user.subdomain,
        subdomain_url: user.subdomain ? `https://${user.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : null,
        custom_domain: user.custom_domain,
        custom_domain_verified: user.custom_domain_verified,
        custom_domain_verified_at: user.custom_domain_verified_at,
        status: user.custom_domain_verified ? "custom_verified" : user.custom_domain ? "custom_pending" : user.subdomain ? "subdomain" : "none",
        full_url: user.custom_domain_verified && user.custom_domain ? `https://${user.custom_domain}` : user.subdomain ? `https://${user.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : null,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/user/subdomain
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const validation = subdomainSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
    const { subdomain } = validation.data;
    const supabase = await createServerSupabaseClient();
    const { data: existing } = await supabase.from("users").select("id").eq("subdomain", subdomain).neq("id", (session.user as any).id).single();
    if (existing) return NextResponse.json({ success: false, error: "Subdomain sudah digunakan" }, { status: 409 });
    const { data: user, error } = await supabase.from("users").update({ subdomain, updated_at: new Date().toISOString() }).eq("id", (session.user as any).id).select("subdomain").single();
    if (error) return NextResponse.json({ success: false, error: "Gagal memperbarui subdomain" }, { status: 500 });
    return NextResponse.json({ success: true, data: { subdomain: user.subdomain, subdomain_url: `https://${user.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` }, message: "Subdomain berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
