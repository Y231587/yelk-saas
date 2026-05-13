"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type DocumentKind = "bon" | "factuur" | "bankafschrift" | "overig";

interface Props {
  customerId: string;
  userId: string;
}

export function DocumentUpload({ customerId, userId }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<DocumentKind>("bon");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  async function handleUpload() {
    if (!file || !customerId) return;
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${customerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type });

      if (storageError) throw storageError;

      // Save record to database
      const { error: dbError } = await supabase.from("documents").insert({
        customer_id: customerId,
        uploaded_by: userId,
        kind,
        file_name: file.name,
        storage_path: path,
        size_bytes: file.size,
        mime_type: file.type,
        notes: notes || null,
      });

      if (dbError) throw dbError;

      toast.success("Document succesvol geüpload!");
      setFile(null);
      setNotes("");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Upload mislukt. Probeer het opnieuw.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Document uploaden</h2>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging ? "border-yelk-400 bg-yelk-50" : "border-slate-200 hover:border-yelk-300 hover:bg-slate-50"
          }`}
        >
          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <div className="text-sm font-medium text-slate-700">
            Sleep een bestand hierheen of <span className="text-yelk-600">klik om te selecteren</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            PDF, JPEG, PNG, XLSX — max. 10 MB
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File preview */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <FileText className="h-8 w-8 text-yelk-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{file.name}</div>
              <div className="text-xs text-slate-500">{formatFileSize(file.size)}</div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Documenttype</label>
              <select
                className="input"
                value={kind}
                onChange={(e) => setKind(e.target.value as DocumentKind)}
              >
                <option value="bon">Bon</option>
                <option value="factuur">Factuur</option>
                <option value="bankafschrift">Bankafschrift</option>
                <option value="overig">Overig</option>
              </select>
            </div>
            <div>
              <label className="label">Notitie (optioneel)</label>
              <input
                className="input"
                type="text"
                placeholder="Bijv. kantoorbenodigdheden..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFile(null)}
              className="btn-secondary flex-1"
            >
              Annuleren
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary flex-1"
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploaden...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Document uploaden</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
