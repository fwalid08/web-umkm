"use client";

/**
 * Sprint 02 US-05 — Form checkout publik (client component).
 * Dipakai di product_grid renderer (server) per produk.
 * POST /api/orders → tampilkan auto-response F5.
 */

import { useState } from "react";

interface Props {
  subdomain: string;
  productName: string;
  productPrice: number;
  primary: string;
}

export function OrderForm({ subdomain, productName, productPrice, primary }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", qty: "1", address: "", notes: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          product_name: productName,
          product_price: productPrice,
          quantity: Number(form.qty) || 1,
          customer_name: form.name,
          customer_phone: form.phone,
          payment_method: "cod",
          delivery_address: form.address,
          notes: form.notes,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Gagal membuat order");
        return;
      }
      setDone(json.data.message as string);
      setOpen(false);
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
        ✅ {done}
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: primary }}
        >
          Pesan Sekarang
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-2 border-t pt-2">
          <input
            required
            placeholder="Nama Anda"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-sm border rounded-lg px-2 py-1.5"
          />
          <div className="flex gap-2">
            <input
              required
              placeholder="No. WA"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex-1 text-sm border rounded-lg px-2 py-1.5"
            />
            <input
              type="number"
              min={1}
              max={99}
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              className="w-16 text-sm border rounded-lg px-2 py-1.5"
            />
          </div>
          <input
            placeholder="Alamat (opsional)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full text-sm border rounded-lg px-2 py-1.5"
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: primary }}
            >
              {loading ? "Mengirim..." : "Kirim Order"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-sm border"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
