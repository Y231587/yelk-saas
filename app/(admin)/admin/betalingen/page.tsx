import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AdminBetalingenPage() {
  const supabase = await createClient();

  const { data: failed } = await supabase
    .from("customers")
    .select("id, company_name, email, contact_name, payment_status, created_at")
    .eq("payment_status", "mislukt")
    .order("created_at", { ascending: false });

  const { data: all } = await supabase
    .from("customers")
    .select("id, company_name, email, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Betalingen</h1>
        <p className="text-slate-500 text-sm mt-1">Overzicht van betalingsstatus per klant.</p>
      </div>

      {/* Failed payments */}
      {(failed ?? []).length > 0 && (
        <div className="card border-red-200">
          <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-semibold text-red-800">
              Mislukte betalingen ({failed?.length})
            </h2>
          </div>
          <div className="divide-y divide-red-50">
            {(failed ?? []).map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{c.company_name}</div>
                  <div className="text-xs text-slate-500">{c.email} · {c.contact_name}</div>
                </div>
                <span className="badge-red text-xs">Betaling mislukt</span>
                <Link href={`/admin/klanten/${c.id}`} className="text-xs text-yelk-600 font-medium">
                  Bekijken →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All payments */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Alle betalingen</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Bedrijf</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">E-mail</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Aangemeld</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(all ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{c.company_name}</td>
                  <td className="px-6 py-3 text-slate-500 hidden md:table-cell">{c.email}</td>
                  <td className="px-6 py-3">
                    <span className={`badge text-xs ${
                      c.payment_status === "betaald" ? "badge-green" :
                      c.payment_status === "mislukt" ? "badge-red" :
                      "badge-yellow"
                    }`}>
                      {c.payment_status === "betaald" ? "Betaald" :
                       c.payment_status === "mislukt" ? "Mislukt" : "Openstaand"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-400 hidden lg:table-cell">{formatDate(c.created_at)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/klanten/${c.id}`} className="text-xs text-yelk-600 font-medium">
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
