import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Stats
  const [
    { count: totalCustomers },
    { count: activeCustomers },
    { count: failedPayments },
    { count: totalDocs },
    { data: recentCustomers },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("status", "actief"),
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("payment_status", "mislukt"),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("id, company_name, status, payment_status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("plan_key, status, packages(monthly_price_eur)")
    .eq("status", "active");

  const totalMRR = (subscriptions ?? []).reduce((sum, s) => {
    const pkg = s.packages as { monthly_price_eur: number } | null;
    return sum + (pkg ? Number(pkg.monthly_price_eur) : 0);
  }, 0);

  const stats = [
    { label: "Totaal klanten", value: totalCustomers ?? 0, icon: Users, color: "bg-blue-50 text-blue-600", change: "Alle accounts" },
    { label: "Actief", value: activeCustomers ?? 0, icon: CheckCircle2, color: "bg-yelk-50 text-yelk-600", change: "Actieve abonnementen" },
    { label: "Mislukte betalingen", value: failedPayments ?? 0, icon: AlertTriangle, color: "bg-red-50 text-red-600", change: "Actie vereist" },
    { label: "MRR", value: formatCurrency(totalMRR), icon: TrendingUp, color: "bg-purple-50 text-purple-600", change: "Maandelijkse omzet" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overzicht van Yelk Finance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.color} mb-3`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm font-medium text-slate-700">{stat.label}</div>
            <div className="text-xs text-slate-400">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Failed payments alert */}
      {(failedPayments ?? 0) > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-sm font-semibold text-red-800">
                {failedPayments} mislukte betaling{(failedPayments ?? 0) > 1 ? "en" : ""}
              </div>
              <div className="text-xs text-red-600">Klanten hebben beperkte toegang.</div>
            </div>
          </div>
          <Link href="/admin/betalingen" className="btn-danger text-xs px-3 py-1.5">
            Bekijken →
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Alle klanten", href: "/admin/klanten", icon: Users },
          { label: "Abonnementen", href: "/admin/abonnementen", icon: CreditCard },
          { label: "Betalingen", href: "/admin/betalingen", icon: AlertTriangle },
          { label: "Documenten", href: "/admin/documenten", icon: FileText },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card-hover p-4 flex flex-col items-center gap-2 text-center">
            <item.icon className="h-6 w-6 text-yelk-500" />
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent customers */}
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Nieuwe klanten</h2>
          <Link href="/admin/klanten" className="text-sm text-yelk-600 font-medium">Alle klanten →</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {(recentCustomers ?? []).map((c) => (
            <Link key={c.id} href={`/admin/klanten/${c.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 text-xs font-bold flex-shrink-0">
                {c.company_name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{c.company_name}</div>
              </div>
              <span className={`badge text-xs ${c.payment_status === "mislukt" ? "badge-red" : c.status === "actief" ? "badge-green" : "badge-yellow"}`}>
                {c.status === "actief" ? "Actief" : c.payment_status === "mislukt" ? "Betaling mislukt" : "Openstaand"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
