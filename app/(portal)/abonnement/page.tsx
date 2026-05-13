import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate, statusLabel } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AbonnementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  const { data: subscription } = customer
    ? await supabase
        .from("subscriptions")
        .select("*, packages(*)")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
    : { data: null };

  const pkg = subscription ? (subscription as Record<string, unknown>).packages as Record<string, unknown> : null;
  const paymentFailed = customer?.payment_status === "mislukt";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abonnement</h1>
        <p className="text-slate-500 text-sm mt-1">Beheer uw pakket en betalingsstatus.</p>
      </div>

      {/* Payment failed alert */}
      {paymentFailed && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-5">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-800 mb-1">Betaling mislukt</div>
            <p className="text-sm text-red-600">
              Uw laatste betaling kon niet worden verwerkt. Neem contact op met ons om uw abonnement te heractiveren.
            </p>
            <a
              href="mailto:info@yelkfinance.nl?subject=Betaling herstellen"
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-red-700 underline"
            >
              Contact opnemen →
            </a>
          </div>
        </div>
      )}

      {/* Current subscription */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-slate-900">Huidig pakket</h2>
          {customer?.status === "actief" && (
            <span className="badge-green">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Actief
            </span>
          )}
        </div>

        {subscription && pkg ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-bold text-slate-900">{String(pkg.name)}</div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {formatCurrency(Number(pkg.monthly_price_eur))} per maand
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Status</div>
                <div className="text-sm font-medium text-slate-900 mt-0.5">
                  {statusLabel(subscription.status)}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Volgende factuur</div>
                  <div className="text-sm font-medium text-slate-900">
                    {subscription.current_period_end
                      ? formatDate(subscription.current_period_end)
                      : "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Betaalwijze</div>
                  <div className="text-sm font-medium text-slate-900 capitalize">
                    {subscription.provider}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs text-slate-500 mb-3">Inbegrepen in uw pakket</div>
              <div className="grid grid-cols-1 gap-2">
                {((pkg.features as string[]) ?? []).map((feat: string) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-yelk-500 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 text-sm mb-4">Geen actief abonnement gevonden.</div>
            <Link href="/pricing" className="btn-primary">
              Bekijk pakketten →
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade section */}
      <div className="card p-6 border-yelk-200 bg-yelk-50">
        <h2 className="text-sm font-semibold text-yelk-800 mb-1">Pakket upgraden?</h2>
        <p className="text-xs text-yelk-600 mb-4">
          Ontdek wat de hogere pakketten extra te bieden hebben.
        </p>
        <Link href="/pricing" className="btn-primary text-sm">
          Pakketten vergelijken →
        </Link>
      </div>

      {/* Cancel */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Abonnement opzeggen</h2>
        <p className="text-xs text-slate-500 mb-4">
          Wilt u uw abonnement opzeggen? Neem contact op en wij regelen dit voor u.
        </p>
        <a
          href="mailto:info@yelkfinance.nl?subject=Abonnement opzeggen"
          className="text-sm text-red-600 hover:text-red-700 font-medium underline"
        >
          Opzeggen via e-mail →
        </a>
      </div>
    </div>
  );
}
