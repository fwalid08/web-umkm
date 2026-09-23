import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });
        if (error || !data.user) return null;
        const { data: profile } = await supabase
          .from("users")
          .select("id, name, business_type, tier, subdomain, trial_ends_at, avatar_url")
          .eq("id", data.user.id)
          .single();
        if (!profile) return null;
        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile.name || data.user.email!,
          image: profile.avatar_url || null,
          tier: (profile.tier as any) || "free",
          subdomain: profile.subdomain,
          business_type: profile.business_type,
          trial_ends_at: profile.trial_ends_at,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        const supabase = await createServerSupabaseClient();
        // Check if user already exists by email
        const { data: existing } = await supabase.from("users").select("id, tier, subdomain").eq("email", user.email).single();
        if (!existing) {
          // Auto-create Supabase auth user + profile for Google user
          // Use service role to create profile directly (no password)
          const newId = crypto.randomUUID();
          const subdomain = `tenant-${newId.slice(0, 8)}`;
          const trialEndsAt = new Date(); trialEndsAt.setDate(trialEndsAt.getDate() + 14);
          const { error } = await supabase.from("users").insert({
            id: newId,
            email: user.email!,
            name: user.name || user.email!.split("@")[0],
            business_type: "retail",
            tier: "free",
            trial_ends_at: trialEndsAt.toISOString(),
            subdomain,
            avatar_url: user.image || null,
            // Note: this separates auth (NextAuth) from Supabase auth. For MVP, we store Google users directly in public.users.
            // Optional: also track google_id if needed
          });
          if (error) console.error("Google auto-create profile error", error);
          // Attach generated id/subdomain to user for jwt
          (user as any).id = newId;
          (user as any).tier = "free";
          (user as any).subdomain = subdomain;
          (user as any).business_type = "retail";
          (user as any).trial_ends_at = trialEndsAt.toISOString();
        } else {
          (user as any).id = existing.id;
          (user as any).tier = (existing as any).tier;
          (user as any).subdomain = (existing as any).subdomain;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = (user as any).id || token.sub;
        token.tier = (user as any).tier;
        token.subdomain = (user as any).subdomain;
        token.business_type = (user as any).business_type;
        token.trial_ends_at = (user as any).trial_ends_at;
        if (account?.provider === "google") {
          token.provider = "google";
        }
      }
      // On subsequent requests, fetch fresh subdomain/tier if missing
      if (!token.subdomain && token.email) {
        try {
          const supabase = await createServerSupabaseClient();
          const { data } = await supabase.from("users").select("tier, subdomain, trial_ends_at").eq("email", token.email as string).single();
          if (data) {
            token.tier = (data as any).tier;
            token.subdomain = (data as any).subdomain;
            token.trial_ends_at = (data as any).trial_ends_at;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).tier = token.tier;
        (session.user as any).subdomain = token.subdomain;
        (session.user as any).business_type = token.business_type;
        (session.user as any).trial_ends_at = token.trial_ends_at;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
});
