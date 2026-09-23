import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/user/domain-status - Get domain status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const { data: user, error } = await supabase
      .from("users")
      .select("subdomain, custom_domain, custom_domain_verified, custom_domain_verified_at, trial_ends_at")
      .eq("id", (session.user as any).id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "saas-saya.com";
    
    let status: "none" | "subdomain" | "custom_pending" | "custom_verified" = "none";
    
    if (user.custom_domain_verified && user.custom_domain) {
      status = "custom_verified";
    } else if (user.custom_domain) {
      status = "custom_pending";
    } else if (user.subdomain) {
      status = "subdomain";
    }

    return NextResponse.json({
      success: true,
      data: {
        has_subdomain: !!user.subdomain,
        subdomain: user.subdomain,
        subdomain_url: user.subdomain ? `https://${user.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : null,
        custom_domain: user.custom_domain,
        custom_domain_verified: user.custom_domain_verified,
        custom_domain_verified_at: user.custom_domain_verified_at,
        status,
        full_url: user.custom_domain_verified && user.custom_domain 
          ? `https://${user.custom_domain}` 
          : user.subdomain 
            ? `https://${user.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` 
            : null,
      }
    });
  } catch (error) {
    console.error("Error fetching domain status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}