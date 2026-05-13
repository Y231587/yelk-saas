import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DocumentUpload } from "@/components/portal/document-upload";
import { DocumentList } from "@/components/portal/document-list";

export default async function DocumentenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("customer_id", customer?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documenten</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload bonnen, facturen en bankafschriften. Wij verwerken ze voor u.
        </p>
      </div>

      <DocumentUpload customerId={customer?.id ?? ""} userId={user.id} />
      <DocumentList documents={documents ?? []} customerId={customer?.id ?? ""} />
    </div>
  );
}
