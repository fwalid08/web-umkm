# UMKM SaaS - Website Builder untuk UMKM Indonesia

Platform SaaS untuk membantu UMKM membangun website toko online profesional dengan template siap pakai.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth.js v5 + Supabase Auth
- **Hosting**: Vercel
- **Payments**: Midtrans / Xendit

## 📦 Fitur Utama

- ✅ 5 Template UMKM (Makanan, Fashion, Kerajinan, Retail, Layanan)
- ✅ Template Fixed Builder — Tanpa Drag & Drop (Theme/Style/Content/Section, tambah/hapus section, ubah theme & konten)
- ✅ Order Management Dashboard
- ✅ Subdomain Otomatis (`tenant-xxx.saas-saya.com`)
- ✅ Custom Domain Support (`tokoku.com`)
- ✅ Free Trial 14 hari (tanpa kartu kredit)
- ✅ Tiered Pricing (Free → Starter Rp99K → Growth Rp299K → Enterprise)

## 🛠️ Setup Development

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- Supabase account
- Vercel account (untuk deploy)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Environment Variables

Copy `.env.example` ke `.env.local` dan isi:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# Payments (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false
```

### Database Setup (Supabase)

1. Buat project di [supabase.com](https://supabase.com)
2. Enable Row Level Security (RLS)
3. Jalankan migrasi di `supabase/migrations/001_initial_schema.sql` di Supabase SQL Editor
4. Copy URL & anon key ke `.env.local`

### Development Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Database
pnpm db:push      # Push migrations to Supabase
pnpm db:reset     # Reset database (development only)
```

## 📁 Project Structure

```
umkm-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (signin, signup)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ui/                # UI primitives (Card, Button, etc)
│   ├── lib/                   # Utilities & configs
│   │   ├── auth.ts            # NextAuth config
│   │   ├── supabase/          # Supabase clients
│   │   └── utils.ts           # Helper functions
│   ├── middleware.ts          # Subdomain extraction
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── .github/workflows/         # CI/CD
```

## 🌐 Subdomain & Custom Domain

### Default Subdomain
Setiap user mendapat: `tenant-{id}.saas-saya.com`

### Custom Domain
User bisa menambahkan domain sendiri:
1. Input domain di Settings > Domain
2. Tambahkan DNS records:
   - TXT: `_saas-verify.tokoku.com` = verification code
   - CNAME: `@` → `saas-saya.com`
3. Sistem verifikasi otomatis setiap 5 menit
4. SSL/HTTPS otomatis via Vercel

## 💰 Pricing Tiers

| Tier | Harga/Bulan | Fitur Utama |
|------|-------------|-------------|
| **Free** | Rp 0 | 3 template, 5 produk, trial 14 hari |
| **Starter** | Rp 99.000 | 5 template, produk unlimited, order dashboard |
| **Growth** | Rp 299.000 | Analytics, auto-followup, 2 payment gateway |
| **Enterprise** | Custom | Repeat order, API, multi-store, custom template |

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## 🚀 Deploy ke Vercel

1. Push ke GitHub
2. Import project di Vercel
2. Tambahkan environment variables
3. Deploy otomatis

### Custom Domain di Vercel
1. Settings > Domains > Add
2. Verifikasi DNS
3. SSL otomatis

## 📄 License

MIT License - bebas digunakan untuk komersial.

---

**UMKM SaaS** - Memberdayakan UMKM Indonesia menjual online dengan mudah.