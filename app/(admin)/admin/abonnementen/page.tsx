import { createClient } from "@/lib/supabase/server";
import { formatDate, planLabel, statusLabel } from "@/lib/utils";
import Link from "next/link";

export default async function AdminAbonnementenPage() {
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, customers(id, company_name, email, status), packages(name, monthly_price_eur)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abonnementen</h1>
        <p className="text-slate-500 text-sm mt-1">{subscriptions?.length ?? 0} abonnementen</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Klant</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Pakket</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Periode tot</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden xl:table-cell">Provider</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(subscriptions ?? []).map((sub) => {
                const customer = sub.customers as { id: string; company_name: string; email: string } | null;
                const pkg = sub.packages as { name: string; monthly_price_eur: number } | null;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer?.company_name ?? "—"}</div>
                      <div className="text-xs text-slate-400 hidden sm:block">{customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-slate-700">{pkg?.name ?? planLabel(sub.plan_key)}</div>
                      <div className="text-xs text-slate-400">€{pkg?.monthly_price_eur}/mnd</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${
                        sub.status === "active" ? "badge-green" :
                        sub.status === "past_due" ? "badge-red" :
                        sub.status === "canceled" ? "badge-slate" :
                        "badge-yellow"
                      }`}>
                        {statusLabel(sub.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 hidden lg:table-cell">
                      {sub.current_period_end ? formatDate(sub.current_period_end) : "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 capitalize hidden xl:table-cell">
                      {sub.provider}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {customer && (
                        <Link href={`/admin/klanten/${customer.id}`} className="text-xs text-yelk-600 font-medium">→</Link>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(subscriptions ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                    Geen abonnementen gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
