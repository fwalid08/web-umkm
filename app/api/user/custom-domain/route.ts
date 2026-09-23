import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { customDomainSchema } from "@/types";

// PUT /api/user/custom-domain - Submit custom domain for verification
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = customDomainSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { domain } = validation.data;
    const supabase = await createServerSupabaseClient();

    // Normalize domain (remove www, protocol)
    const normalizedDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");

    // Check if domain is already used by another user
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("custom_domain", normalizedDomain)
      .neq("id", (session.user as any).id)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Domain sudah digunakan oleh user lain" },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationCode = `saas-verify-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Update user with custom domain and verification code
    const { data: user, error } = await supabase
      .from("users")
      .update({
        custom_domain: normalizedDomain,
        custom_domain_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (session.user as any).id)
      .select("custom_domain")
      .single();

    if (error) {
      console.error("Error updating custom domain:", error);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan domain" },
        { status: 500 }
      );
    }

    // Generate DNS instructions
    const dnsInstructions = [
      {
        type: "TXT",
        name: `_saas-verify.${normalizedDomain}`,
        value: verificationCode,
        description: "Untuk verifikasi kepemilikan domain",
      },
      {
        type: "CNAME",
        name: "@",
        value: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "saas-saya.com"}`,
        description: "Arahkan ke platform SaaS",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain: normalizedDomain,
        verification_code: verificationCode,
        dns_instructions: dnsInstructions,
      },
      message: "Domain disimpan. Silakan tambahkan record DNS untuk verifikasi.",
    });
  } catch (error) {
    console.error("Error submitting custom domain:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}