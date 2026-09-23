"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  ExternalLink,
  ArrowUpRight,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  href?: string;
}

function StatCard({ title, value, change, changeType, icon, href }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {href && (
          <a href={href} className="text-primary-600 hover:underline text-xs">
            Lihat detail →
          </a>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`text-xs font-medium ${
                    changeType === "positive"
                      ? "text-green-600"
                      : changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: "Total Pesanan",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/dashboard/orders",
    },
    {
      title: "Pesanan Hari Ini",
      value: "3",
      change: "+2",
      changeType: "positive" as const,
      icon: <Clock className="h-6 w-6" />,
      href: "/dashboard/orders",
    },
    {
      title: "Total Pelanggan",
      value: "18",
      change: "+5",
      changeType: "positive" as const,
      icon: <Users className="h-6 w-6" />,
      href: "/dashboard/customers",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: "Rp 4.200.000",
      change: "+18%",
      changeType: "positive" as const,
      icon: <DollarSign className="h-6 w-6" />,
      href: "/dashboard/analytics",
    },
  ];

  // Mock recent orders
  const recentOrders = [
    { id: "ORD-001", customer: "Budi Santoso", product: "Nasi Goreng Spesial", amount: 25000, status: "baru", time: "10 menit lalu" },
    { id: "ORD-002", customer: "Siti Rahayu", product: "Kaos Polos Premium", amount: 75000, status: "dikirim", time: "1 jam lalu" },
    { id: "ORD-003", customer: "Ahmad Wijaya", product: "Kerajinan Bambu", amount: 120000, status: "konfirmasi", time: "2 jam lalu" },
    { id: "ORD-004", customer: "Dewi Sartika", product: "Sepatu Sneakers", amount: 350000, status: "selesai", time: "5 jam lalu" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      baru: "bg-blue-100 text-blue-700",
      konfirmasi: "bg-yellow-100 text-yellow-700",
      dikirim: "bg-purple-100 text-purple-700",
      selesai: "bg-green-100 text-green-700",
    };
    const labels = {
      baru: "Baru",
      konfirmasi: "Konfirmasi",
      dikirim: "Dikirim",
      selesai: "Selesai",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const subdomain = "tenant-abc12345"; // Mock - get from session

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Selamat datang kembali, {session?.user?.name || "Pengguna"}!</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/builder" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2">
            <span>Bangun Website</span>
          </Link>
        </div>
      </div>

      {/* Trial banner for free users */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-yellow-800">Masa Coba Gratis 14 Hari</p>
              <p className="text-sm text-yellow-700">Masa coba berakhir dalam 10 hari. Upgrade ke Starter (Rp 99.000/bulan) untuk akses penuh.</p>
            </p>
            </div>
          </div>
          <Link href="/dashboard/settings/billing" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium">
            Upgrade Sekarang
          </Link>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="p-2 bg-primary-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </span>
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/builder" className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <span className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <span className="text-xl">🎨</span>
              </span>
              <div>
                <p className="font-medium text-gray-900">Bangun Website</p>
                <p className="text-sm text-gray-500">Pilih template & customisasi</p>
              </div>
            </Link>
            <Link href="/dashboard/products" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="p-2 bg-green-100 rounded-lg text-green-600">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-gray-900">Tambah Produk</p>
                <p className="text-sm text-gray-500">Kelola katalog toko Anda</p>
              </div>
            </Link>
            <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-gray-900">Kelola Pesanan</p>
                <p className="text-sm text-gray-500">Lihat & proses pesanan masuk</p>
              </div>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Settings className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-gray-900">Pengaturan</p>
                <p className="text-sm text-gray-500">Domain, profil, notifikasi</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pesanan Terbaru</CardTitle>
            <Link href="/dashboard/orders" className="text-sm text-primary-600 hover:underline">
              Lihat semua →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Pesanan</th>
                    <th className="pb-3 font-medium">Pelanggan</th>
                    <th className="pb-3 font-medium">Produk</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 font-mono text-sm font-medium">{order.id}</td>
                      <td className="py-3">
                        <p className="font-medium">{order.customer}</p>
                      </td>
                      <td className="py-3 text-gray-600">{order.product}</td>
                      <td className="py-3 text-right font-medium">Rp {order.amount.toLocaleString("id-ID")}</td>
                      <td className="py-3">{getStatusBadge(order.status)}</td>
                      <td className="py-3 text-sm text-gray-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Preview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Website Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <ExternalLink className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Website Siap Digunakan</h3>
            <p className="text-gray-500 mb-4">
              Subdomain Anda: <code className="bg-gray-100 px-2 py-1 rounded">tenant-abc12345.saas-saya.com</code>
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="https://tenant-abc12345.saas-saya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Lihat Website
              </Link>
              <Link href="/dashboard/builder" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Edit Website
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}