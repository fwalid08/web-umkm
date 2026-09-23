"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Website Builder", href: "/dashboard/builder", icon: Sparkles },
  { name: "Produk", href: "/dashboard/products", icon: Store },
  { name: "Pesanan", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Pelanggan", href: "/dashboard/customers", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;
  const subdomain = (user as any)?.subdomain;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "saas-saya.com";
  const websiteUrl = subdomain ? `https://${subdomain}.saas-saya.com` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">US</span>
              </div>
              <span className="font-bold text-lg text-gray-900">UMKM SaaS</span>
            </Link>
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Website URL */}
          {websiteUrl && (
            <div className="px-4 py-3 border-b bg-green-50">
              <p className="text-xs text-gray-500 mb-1">Website Anda:</p>
              <a
                href={`https://${(user as any)?.subdomain}.saas-saya.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline truncate block"
              >
                {(user as any)?.subdomain}.saas-saya.com
              </a>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {(user as any)?.name?.charAt(0).toUpperCase() || (user as any)?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{(user as any)?.name}</p>
                <p className="text-xs text-gray-500 truncate">{(user as any)?.email}</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              {/* Tier badge */}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  (user as any)?.tier === "free"
                    ? "bg-gray-100 text-gray-700"
                    : (user as any)?.tier === "starter"
                    ? "bg-blue-100 text-blue-700"
                    : (user as any)?.tier === "growth"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {(user as any)?.tier === "free" && "Gratis"}
                {(user as any)?.tier === "starter" && "Starter"}
                {(user as any)?.tier === "growth" && "Growth"}
                {(user as any)?.tier === "enterprise" && "Enterprise"}
              </span>

              {/* Website link */}
              {websiteUrl && (
                <a
                  href={`https://${(user as any)?.subdomain}.saas-saya.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-600 hover:underline hidden sm:flex"
                >
                  <Globe className="h-4 w-4" />
                  <span className="truncate max-w-[150px]">
                    {(user as any)?.subdomain}.saas-saya.com
                  </span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}