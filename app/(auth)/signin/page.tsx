"use client";
import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setErr(""); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setErr("");
    try {
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
      if (result?.error) setErr("Email atau password salah"); else { router.push(callbackUrl); router.refresh(); }
    } catch { setErr("Terjadi kesalahan. Silakan coba lagi."); } finally { setIsLoading(false); }
  };
  return (
    <div className="max-w-md w-full space-y-6">
      <div className="text-center"><h1 className="text-3xl font-bold">Masuk ke Akun</h1><p className="mt-2 text-gray-600">Atau <Link href="/signup" className="text-green-600 font-medium">daftar gratis</Link></p></div>
      <button onClick={()=> signIn("google", { callbackUrl })} className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 font-medium">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09A6.99 6.99 0 0 1 5.48 12s0-.69.36-1.09V8.07H2.18A10.76 10.76 0 0 0 1 12c0 1.74.42 3.38 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Masuk dengan Google
      </button>
      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">atau</span><div className="flex-1 h-px bg-gray-200"/></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {err && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{err}</div>}
        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="email@domain.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" /></div>
        <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="password" name="password" type={showPassword?"text":"password"} required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword?<EyeOff className="h-5 w-5"/>:<Eye className="h-5 w-5"/>}</button></div>
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">{isLoading?"Masuk...":"Masuk"}</button>
      </form>
      <p className="text-center text-sm text-gray-600">Belum punya akun? <Link href="/signup" className="text-green-600 font-medium">Daftar gratis</Link></p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
