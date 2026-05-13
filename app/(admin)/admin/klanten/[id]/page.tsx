import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate, formatFileSize, planLabel, statusLabel } from "@/lib/utils";
import { ArrowLeft, FileText, CreditCard, User, Building2 } from "lucide-react";
import Link from "next/link";
import { AdminCustomerActions } from "@/components/admin/customer-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminKlantDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) notFound();

  const [
    { data: profile },
    { data: subscriptions },
    { data: documents },
    { data: _transactions },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", customer.owner_id).single(),
    supabase.from("subscriptions").select("*, packages(*)").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("transactions").select("*").eq("customer_id", id).order("booked_on", { ascending: false }).limit(10),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/klanten" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Terug
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{customer.company_name}</h1>
          <p className="text-sm text-slate-500">Klantprofiel</p>
        </div>
        <div className="ml-auto">
          <span className={`badge text-sm ${
            customer.status === "actief" ? "badge-green" :
            customer.payment_status === "mislukt" ? "badge-red" :
            "badge-yellow"
          }`}>
            {customer.status === "actief" ? "Actief" :
             customer.payment_status === "mislukt" ? "⚠ Betaling mislukt" :
             statusLabel(customer.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-yelk-500" /> Bedrijfsgegevens
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Bedrijfsnaam", value: customer.company_name },
                { label: "Contactpersoon", value: customer.contact_name ?? "—" },
                { label: "E-mail", value: customer.email ?? "—" },
                { label: "Telefoon", value: customer.phone ?? "—" },
                { label: "KvK-nummer", value: customer.kvk_number ?? "—" },
                { label: "BTW-nummer", value: customer.vat_number ?? "—" },
                { label: "Aangemeld", value: formatDate(customer.created_at) },
                { label: "Betaalstatus", value: statusLabel(customer.payment_status) },
              ].map((row) => (
                <div key={row.label}>
                  <div className="text-xs text-slate-500">{row.label}</div>
                  <div className="font-medium text-slate-900 mt-0.5">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="card">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-yelk-500" /> Abonnementen
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {(subscriptions ?? []).length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">Geen abonnementen gevonden.</div>
              ) : (subscriptions ?? []).map((sub) => {
                const pkg = sub.packages as unknown as { name: string; monthly_price_eur: number } | null;
                return (
                  <div key={sub.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{pkg?.name ?? planLabel(sub.plan_key)}</div>
                      <div className="text-xs text-slate-400">
                        Provider: {sub.provider} · Tot: {sub.current_period_end ? formatDate(sub.current_period_end) : "—"}
                      </div>
                    </div>
                    <span className={`badge text-xs ${sub.status === "active" ? "badge-green" : sub.status === "past_due" ? "badge-red" : "badge-yellow"}`}>
                      {statusLabel(sub.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-yelk-500" /> Documenten ({documents?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {(documents ?? []).length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">Geen documenten geüpload.</div>
              ) : (documents ?? []).slice(0, 10).map((doc) => (
                <div key={doc.id} className="px-6 py-3 flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-900 truncate">{doc.file_name}</div>
                    <div className="text-xs text-slate-400">{doc.kind} · {formatFileSize(doc.size_bytes)}</div>
                  </div>
                  <div className="text-xs text-slate-400">{formatDate(doc.created_at)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-yelk-500" /> Account
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-xs text-slate-500">Naam</div>
                <div className="font-medium text-slate-900">{profile?.full_name ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">E-mail</div>
                <div className="font-medium text-slate-900 break-all">{profile?.email}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Rol</div>
                <div className="font-medium text-slate-900 capitalize">{profile?.role}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <AdminCustomerActions customerId={id} currentStatus={customer.status} currentPaymentStatus={customer.payment_status} />
        </div>
      </div>
    </div>
  );
}
