import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download } from "lucide-react";

export default async function FacturenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  const { data: invoices } = customer
    ? await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const statusColor = (s: string) =>
    s === "paid" ? "badge-green" : s === "overdue" ? "badge-red" : "badge-yellow";

  const statusLabel = (s: string) =>
    ({ open: "Open", paid: "Betaald", overdue: "Verlopen", canceled: "Geannuleerd" }[s] ?? s);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Facturen & betalingen</h1>
        <p className="text-slate-500 text-sm mt-1">Overzicht van uw facturen en abonnementsbetalingen.</p>
      </div>

      <div className="card overflow-hidden">
        {(invoices ?? []).length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Nog geen facturen beschikbaar.</p>
            <p className="text-slate-400 text-xs mt-1">Facturen worden aangemaakt na verwerking van uw betaling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Factuurnr.</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Omschrijving</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Bedrag</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Datum</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoices ?? []).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-900">{inv.invoice_number}</td>
                    <td className="px-6 py-4 text-slate-600 hidden md:table-cell truncate max-w-[200px]">
                      {inv.description ?? "Abonnementsfactuur"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(Number(inv.amount_eur))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${statusColor(inv.status)}`}>
                        {statusLabel(inv.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 hidden lg:table-cell">
                      {formatDate(inv.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
