"use client";

import { useState } from "react";
import { FileText, Download, Trash2, Filter } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Document } from "@/types";

interface Props {
  documents: Document[];
  customerId: string;
}

const KIND_LABELS: Record<string, string> = {
  bon: "Bon",
  factuur: "Factuur",
  bankafschrift: "Bankafschrift",
  overig: "Overig",
};

const KIND_COLORS: Record<string, string> = {
  bon: "badge-green",
  factuur: "badge-slate",
  bankafschrift: "badge-yellow",
  overig: "badge-slate",
};

export function DocumentList({ documents, customerId: _customerId }: Props) {
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filtered = filter === "all" ? documents : documents.filter((d) => d.kind === filter);

  async function handleDelete(doc: Document) {
    if (!confirm(`"${doc.file_name}" verwijderen?`)) return;
    setDeleting(doc.id);

    const supabase = createClient();
    await supabase.storage.from("documents").remove([doc.storage_path]);
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);

    if (error) {
      toast.error("Verwijderen mislukt.");
    } else {
      toast.success("Document verwijderd.");
      router.refresh();
    }
    setDeleting(null);
  }

  async function handleDownload(doc: Document) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    } else {
      toast.error("Download mislukt.");
    }
  }

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          Alle documenten
          <span className="ml-2 text-xs font-normal text-slate-400">({filtered.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            className="input py-1.5 text-xs w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Alle types</option>
            <option value="bon">Bonnen</option>
            <option value="factuur">Facturen</option>
            <option value="bankafschrift">Bankafschriften</option>
            <option value="overig">Overig</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-16 text-center text-slate-400 text-sm">
          Geen documenten gevonden.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((doc) => (
            <div key={doc.id} className="px-6 py-4 flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{doc.file_name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`badge text-xs ${KIND_COLORS[doc.kind]}`}>
                    {KIND_LABELS[doc.kind]}
                  </span>
                  <span className="text-xs text-slate-400">{formatFileSize(doc.size_bytes)}</span>
                  {doc.notes && (
                    <span className="text-xs text-slate-400 truncate hidden sm:block">{doc.notes}</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 hidden sm:block">{formatDate(doc.created_at)}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Downloaden"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={deleting === doc.id}
                  className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  title="Verwijderen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
