// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "klant" | "admin";

export type CustomerStatus = "actief" | "proef" | "geannuleerd" | "openstaand";

export type PaymentStatus = "betaald" | "openstaand" | "mislukt" | "terugbetaald";

export type PlanKey = "start" | "groei" | "pro";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type PaymentProvider = "stripe" | "mollie" | "manual";

export type DocumentKind = "bon" | "factuur" | "bankafschrift" | "overig";

export type TransactionDirection = "in" | "out";

export type VatReturnStatus = "concept" | "ingediend" | "betaald";

// ─── Database Tables ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Customer {
  id: string;
  owner_id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  vat_number: string | null;
  kvk_number: string | null;
  status: CustomerStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface Package {
  key: PlanKey;
  name: string;
  monthly_price_eur: number;
  setup_fee_eur: number;
  features: string[];
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan_key: PlanKey;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  provider_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  customer_id: string;
  uploaded_by: string;
  kind: DocumentKind;
  file_name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
  notes: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  booked_on: string;
  description: string;
  amount_eur: number;
  vat_eur: number;
  category: string | null;
  direction: TransactionDirection;
  created_at: string;
}

export interface VatReturn {
  id: string;
  customer_id: string;
  period: string;
  total_revenue: number;
  total_vat: number;
  status: VatReturnStatus;
  submitted_at: string | null;
  created_at: string;
}

// ─── Extended / Joined Types ──────────────────────────────────────────────────

export interface CustomerWithProfile extends Customer {
  profile: Profile;
}

export interface SubscriptionWithPackage extends Subscription {
  package: Package;
}

export interface CustomerFull extends Customer {
  profile: Profile;
  subscriptions: SubscriptionWithPackage[];
  documents: Document[];
}

// ─── Mollie Types ─────────────────────────────────────────────────────────────

export interface MolliePaymentMeta {
  customer_id: string;
  plan_key: PlanKey;
  is_first: boolean;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PricingPlan {
  key: PlanKey;
  name: string;
  price: number;
  setupFee: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeCustomers: number;
  pendingPayments: number;
  documentsUploaded: number;
  recentTransactions: Transaction[];
}
