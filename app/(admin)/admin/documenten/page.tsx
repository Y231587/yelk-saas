import { createClient } from "@/lib/supabase/server";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminDocumentenPage() {
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from("documents")
    .select("*, customers(id, company_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const kindLabels: Record<string, string> = {
    bon: "Bon",
    factuur: "Factuur",
    bankafschrift: "Bankafschrift",
    overig: "Overig",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documenten</h1>
        <p className="text-slate-500 text-sm mt-1">{documents?.length ?? 0} documenten totaal</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Bestand</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Klant</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Grootte</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden xl:table-cell">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(documents ?? []).map((doc) => {
                const cust = doc.customers as unknown as { id: string; company_name: string } | null;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-900 truncate max-w-[180px]">{doc.file_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      {cust ? (
                        <Link href={`/admin/klanten/${cust.id}`} className="text-yelk-600 hover:underline text-xs">
                          {cust.company_name}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell">
                      <span className="badge-slate text-xs">{kindLabels[doc.kind] ?? doc.kind}</span>
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-400 hidden lg:table-cell">{formatFileSize(doc.size_bytes)}</td>
                    <td className="px-6 py-3 text-xs text-slate-400 hidden xl:table-cell">{formatDate(doc.created_at)}</td>
                  </tr>
                );
              })}
              {(documents ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                    Geen documenten gevonden.
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
