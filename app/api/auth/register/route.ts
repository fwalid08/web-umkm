import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signUpSchema, type SignUpInput } from "@/types";

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, business_type } = validation.data;
    const supabase = await createServerSupabaseClient();

    // Check if email already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser.users.some((u: any) => u.email === email);

    if (userExists) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        business_type,
      },
    });

    if (authError || !authData.user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { success: false, error: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    // Generate unique subdomain
    const subdomain = `tenant-${authData.user.id.slice(0, 8)}`;

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Create user profile
    const { data: user, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        name,
        business_type,
        tier: "free",
        trial_ends_at: trialEndsAt.toISOString(),
        subdomain: `tenant-${authData.user.id.slice(0, 8)}`,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { success: false, error: "Gagal membuat profil user" },
        { status: 500 }
      );
    }

    // Create default subscription record
    await supabase.from("subscriptions").insert({
      user_id: authData.user.id,
      tier: "free",
      status: "trialing",
      current_period_start: new Date().toISOString(),
      current_period_end: trialEndsAt.toISOString(),
      payment_gateway: "none",
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan masuk ke akun Anda.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subdomain: user.subdomain,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}