import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, planLabel, statusLabel } from "@/lib/utils";
import {
  FileText,
  Upload,
  AlertCircle,
  Euro,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: customer } = await supabase.from("customers").select("*").eq("owner_id", user.id).single();
  
  let subscription = null;
  let documents: unknown[] = [];
  let transactions: unknown[] = [];

  if (customer) {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*, packages(*)")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(1);
    subscription = subs?.[0] ?? null;

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(5);
    documents = docs ?? [];

    const { data: txns } = await supabase
      .from("transactions")
      .select("*")
      .eq("customer_id", customer.id)
      .order("booked_on", { ascending: false })
      .limit(5);
    transactions = txns ?? [];
  }

  const paymentFailed = customer?.payment_status === "mislukt";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Payment failed banner */}
      {paymentFailed && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-800">Betaling mislukt</div>
            <div className="text-sm text-red-600 mt-0.5">
              Uw laatste betaling kon niet worden verwerkt. Uw account heeft beperkte toegang.{" "}
              <Link href="/abonnement" className="underline font-medium">Betaling herstellen →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Goedendag, {profile?.full_name?.split(" ")[0] ?? "gebruiker"} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Hier is een overzicht van uw administratie.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-slate-500">Abonnement</div>
          <div className="text-lg font-bold text-slate-900">
            {subscription ? planLabel((subscription as { plan_key: string }).plan_key) : "—"}
          </div>
          <div className={`text-xs mt-1 ${customer?.status === "actief" ? "text-yelk-600" : "text-amber-600"}`}>
            {customer ? statusLabel(customer.status) : "Geen abonnement"}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-xs text-slate-500">Documenten</div>
          <div className="text-lg font-bold text-slate-900">{documents.length}</div>
          <div className="text-xs text-slate-400 mt-1">geüpload</div>
        </div>

        <div className="stat-card">
          <div className="text-xs text-slate-500">Transacties</div>
          <div className="text-lg font-bold text-slate-900">{transactions.length}</div>
          <div className="text-xs text-slate-400 mt-1">geboekt</div>
        </div>

        <div className="stat-card">
          <div className="text-xs text-slate-500">Abonnement loopt tot</div>
          <div className="text-sm font-bold text-slate-900">
            {subscription && (subscription as { current_period_end: string | null }).current_period_end
              ? formatDate((subscription as { current_period_end: string }).current_period_end)
              : "—"}
          </div>
          <div className="text-xs text-slate-400 mt-1">volgende factuur</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/documenten" className="card-hover p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yelk-50">
            <Upload className="h-5 w-5 text-yelk-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Document uploaden</div>
            <div className="text-xs text-slate-500">Bon, factuur of afschrift</div>
          </div>
        </Link>

        <Link href="/facturen" className="card-hover p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Facturen bekijken</div>
            <div className="text-xs text-slate-500">Betalingsoverzicht</div>
          </div>
        </Link>

        <Link href="/abonnement" className="card-hover p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Euro className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Abonnement</div>
            <div className="text-xs text-slate-500">Beheer uw pakket</div>
          </div>
        </Link>
      </div>

      {/* Recent documents */}
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recente documenten</h2>
          <Link href="/documenten" className="text-sm text-yelk-600 hover:text-yelk-700 font-medium">
            Alle documenten →
          </Link>
        </div>
        {documents.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            Nog geen documenten geüpload. <Link href="/documenten" className="text-yelk-600 underline">Upload uw eerste document</Link>.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {(documents as Array<{id: string; file_name: string; kind: string; created_at: string}>).map((doc) => (
              <div key={doc.id} className="px-6 py-3 flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 truncate">{doc.file_name}</div>
                  <div className="text-xs text-slate-400">{doc.kind}</div>
                </div>
                <div className="text-xs text-slate-400">{formatDate(doc.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
