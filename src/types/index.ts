/**
 * Type definitions for UMKM SaaS
 */

// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  business_type: BusinessType;
  tier: Tier;
  subdomain: string | null;
  custom_domain: string | null;
  custom_domain_verified: boolean;
  custom_domain_verified_at: string | null;
  trial_ends_at: string | null;
  current_template_id: string | null;
  created_at: string;
  updated_at: string;
}

export type BusinessType = "food" | "fashion" | "handicraft" | "retail" | "services";

export type Tier = "free" | "starter" | "growth" | "enterprise";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  subdomain: string | null;
  business_type: BusinessType;
  trial_ends_at: string | null;
}

// Template Types
export interface Template {
  id: string;
  name: BusinessType;
  description: string;
  color_palette: ColorPalette;
  typography_config: TypographyConfig;
  sections_config: SectionConfig[];
  is_active: boolean;
  created_at: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  text_light: string;
  border: string;
}

export interface TypographyConfig {
  heading_font: string;
  body_font: string;
  base_size: number;
  scale_ratio: number;
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  label: string;
  default_props: Record<string, any>;
  required: boolean;
  order: number;
}

export type SectionType =
  | "hero"
  | "product_grid"
  | "image_gallery"
  | "contact_info"
  | "whatsapp_button"
  | "location_map"
  | "testimonials"
  | "about"
  | "faq"
  | "promo_banner";

// Order Types
export interface Order {
  id: string;
  user_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
  status: OrderStatus;
  order_date: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "baru" | "konfirmasi" | "dikirim" | "selesai";

export type PaymentMethod = "cash" | "cod" | "transfer";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  tier: Tier;
  price_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
  payment_gateway: string | null;
  payment_reference: string | null;
  created_at: string;
}

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

// Domain Types
export interface DomainStatus {
  has_subdomain: boolean;
  subdomain: string | null;
  subdomain_url: string | null;
  custom_domain: string | null;
  custom_domain_verified: boolean;
  custom_domain_verified_at: string | null;
  status: "none" | "subdomain" | "custom_pending" | "custom_verified";
  full_url: string;
}

export interface CustomDomainPayload {
  domain: string; // e.g., "tokoku.com" or "www.tokoku.com"
}

export interface DomainVerificationResult {
  success: boolean;
  message: string;
  verification_code?: string;
  dns_instructions?: DnsInstruction[];
}

export interface DnsInstruction {
  type: "CNAME" | "A" | "TXT";
  name: string;
  value: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Dashboard Types
export interface DashboardStats {
  total_orders: number;
  today_orders: number;
  this_week_orders: number;
  this_month_orders: number;
  pending_orders: number;
  total_revenue: number;
  top_products: ProductStat[];
  daily_trend: DailyTrend[];
}

export interface ProductStat {
  product_name: string;
  order_count: number;
  total_revenue: number;
}

export interface DailyTrend {
  date: string;
  orders: number;
  revenue: number;
}

// Form Validation Schemas (using Zod)
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  business_type: z.enum(["food", "fashion", "handicraft", "retail", "services"]),
});

export const signInSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain minimal 3 karakter")
    .max(50, "Subdomain maksimal 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Subdomain hanya boleh huruf kecil, angka, dan strip"),
});

export const customDomainSchema = z.object({
  domain: z
    .string()
    .min(4, "Domain tidak valid")
    .regex(
      /^([a-z0-9-]+\.)+[a-z]{2,}$/i,
      "Format domain tidak valid (contoh: tokoku.com)"
    ),
});

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  stock: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SubdomainInput = z.infer<typeof subdomainSchema>;
export type CustomDomainInput = z.infer<typeof customDomainSchema>;
export type ProductInput = z.infer<typeof productSchema>;