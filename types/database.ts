export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "klant" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "klant" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "klant" | "admin";
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          owner_id: string;
          company_name: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          vat_number: string | null;
          kvk_number: string | null;
          status: "actief" | "proef" | "geannuleerd" | "openstaand";
          payment_status: "betaald" | "openstaand" | "mislukt" | "terugbetaald";
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          company_name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          vat_number?: string | null;
          kvk_number?: string | null;
          status?: "actief" | "proef" | "geannuleerd" | "openstaand";
          payment_status?: "betaald" | "openstaand" | "mislukt" | "terugbetaald";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      packages: {
        Row: {
          key: "start" | "groei" | "pro";
          name: string;
          monthly_price_eur: number;
          setup_fee_eur: number;
          features: string[];
        };
        Insert: Database["public"]["Tables"]["packages"]["Row"];
        Update: Partial<Database["public"]["Tables"]["packages"]["Row"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          customer_id: string;
          plan_key: "start" | "groei" | "pro";
          status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          provider: "stripe" | "mollie" | "manual";
          provider_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          plan_key: "start" | "groei" | "pro";
          status?: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          provider?: "stripe" | "mollie" | "manual";
          provider_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          customer_id: string;
          uploaded_by: string;
          kind: "bon" | "factuur" | "bankafschrift" | "overig";
          file_name: string;
          storage_path: string;
          size_bytes: number;
          mime_type: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          uploaded_by: string;
          kind?: "bon" | "factuur" | "bankafschrift" | "overig";
          file_name: string;
          storage_path: string;
          size_bytes?: number;
          mime_type?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          customer_id: string;
          invoice_number: string;
          amount_eur: number;
          status: "open" | "paid" | "overdue" | "canceled";
          due_date: string | null;
          paid_at: string | null;
          mollie_payment_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          invoice_number: string;
          amount_eur: number;
          status?: "open" | "paid" | "overdue" | "canceled";
          due_date?: string | null;
          paid_at?: string | null;
          mollie_payment_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          kind: "info" | "warning" | "error" | "success";
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          kind?: "info" | "warning" | "error" | "success";
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          customer_id: string;
          booked_on: string;
          description: string;
          amount_eur: number;
          vat_eur: number;
          category: string | null;
          direction: "in" | "out";
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          booked_on?: string;
          description: string;
          amount_eur?: number;
          vat_eur?: number;
          category?: string | null;
          direction: "in" | "out";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
