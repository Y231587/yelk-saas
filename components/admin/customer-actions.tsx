"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { CustomerStatus, PaymentStatus } from "@/types";

interface Props {
  customerId: string;
  currentStatus: CustomerStatus;
  currentPaymentStatus: PaymentStatus;
}

export function AdminCustomerActions({ customerId, currentStatus, currentPaymentStatus }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(status: CustomerStatus) {
    setLoading(status);
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .update({ status })
      .eq("id", customerId);

    if (error) {
      toast.error("Bijwerken mislukt.");
    } else {
      toast.success("Status bijgewerkt.");
      router.refresh();
    }
    setLoading(null);
  }

  async function updatePaymentStatus(payment_status: PaymentStatus) {
    setLoading(payment_status);
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .update({ payment_status })
      .eq("id", customerId);

    if (error) {
      toast.error("Bijwerken mislukt.");
    } else {
      toast.success("Betaalstatus bijgewerkt.");
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">Acties</h2>

      <div className="space-y-2">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Accountstatus</p>

        <button
          onClick={() => updateStatus("actief")}
          disabled={!!loading || currentStatus === "actief"}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all bg-yelk-50 text-yelk-700 hover:bg-yelk-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "actief" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Activeren
          {currentStatus === "actief" && <span className="ml-auto text-xs text-yelk-500">Huidig</span>}
        </button>

        <button
          onClick={() => updateStatus("geannuleerd")}
          disabled={!!loading || currentStatus === "geannuleerd"}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "geannuleerd" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
          Annuleren
          {currentStatus === "geannuleerd" && <span className="ml-auto text-xs text-red-400">Huidig</span>}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Betaalstatus</p>

        <button
          onClick={() => updatePaymentStatus("betaald")}
          disabled={!!loading || currentPaymentStatus === "betaald"}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "betaald" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Markeer als betaald
        </button>

        <button
          onClick={() => updatePaymentStatus("openstaand")}
          disabled={!!loading || currentPaymentStatus === "openstaand"}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "openstaand" ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
          Markeer als openstaand
        </button>
      </div>
    </div>
  );
}
