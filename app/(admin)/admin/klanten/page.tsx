import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminKlantenPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? "";
  const statusFilter = params.status ?? "";

  const supabase = await createClient();

  let req = supabase
    .from("customers")
    .select("id, company_name, contact_name, email, phone, status, payment_status, created_at")
    .order("created_at", { ascending: false });

  if (statusFilter) req = req.eq("status", statusFilter as "actief" | "proef" | "geannuleerd" | "openstaand");
  if (query) {
    req = req.or(
      `company_name.ilike.%${query}%,contact_name.ilike.%${query}%,email.ilike.%${query}%`
    );
  }

  const { data: customers } = await req;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Klanten</h1>
          <p className="text-slate-500 text-sm mt-1">{customers?.length ?? 0} klanten gevonden</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Alle", value: "" },
          { label: "Actief", value: "actief" },
          { label: "Proef", value: "proef" },
          { label: "Openstaand", value: "openstaand" },
          { label: "Geannuleerd", value: "geannuleerd" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/admin/klanten?${query ? `q=${query}&` : ""}status=${f.value}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              statusFilter === f.value
                ? "bg-yelk-500 text-white border-yelk-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Bedrijf</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Betaling</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden xl:table-cell">Aangemeld</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(customers ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{c.company_name}</div>
                    <div className="text-xs text-slate-400 md:hidden">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-slate-700">{c.contact_name ?? "—"}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`badge text-xs ${
                      c.status === "actief" ? "badge-green" :
                      c.status === "geannuleerd" ? "badge-red" :
                      "badge-yellow"
                    }`}>
                      {c.status === "actief" ? "Actief" : c.status === "proef" ? "Proef" : c.status === "geannuleerd" ? "Geannuleerd" : "Openstaand"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`badge text-xs ${
                      c.payment_status === "betaald" ? "badge-green" :
                      c.payment_status === "mislukt" ? "badge-red" :
                      "badge-yellow"
                    }`}>
                      {c.payment_status === "betaald" ? "Betaald" : c.payment_status === "mislukt" ? "⚠ Mislukt" : "Openstaand"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 hidden xl:table-cell">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/klanten/${c.id}`}
                      className="text-xs text-yelk-600 hover:text-yelk-700 font-medium"
                    >
                      Bekijken →
                    </Link>
                  </td>
                </tr>
              ))}
              {(customers ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">
                    Geen klanten gevonden.
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
