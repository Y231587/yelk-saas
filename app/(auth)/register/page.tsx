"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Package, PlanKey } from "@/types";

const PLAN_INFO: Record<string, { price: number; setup: number; label: string }> = {
  start: { price: 99, setup: 199, label: "Yelk Start" },
  groei: { price: 150, setup: 199, label: "Yelk Groei" },
  pro: { price: 199, setup: 199, label: "Yelk E-commerce" },
};

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const planParam = (searchParams.get("plan") as PlanKey) ?? "groei";

  const [step, setStep] = useState<"account" | "bedrijf" | "betaling">("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    kvk_number: "",
    vat_number: "",
    phone: "",
    plan: planParam,
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "account") { setStep("bedrijf"); return; }
    if (step === "bedrijf") { setStep("betaling"); return; }

    // Step 3: create account + initiate Mollie payment
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Registratie mislukt");

      // Redirect to Mollie checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success("Account aangemaakt! U kunt nu inloggen.");
        window.location.href = "/login";
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Er is iets misgegaan.";
      setError(message);
      setLoading(false);
    }
  }

  const plan = PLAN_INFO[form.plan] ?? PLAN_INFO.groei;
  const total = plan.price + plan.setup;

  return (
    <div className="w-full max-w-lg">
      <div className="card p-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["account", "bedrijf", "betaling"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === s
                    ? "bg-yelk-500 text-white"
                    : i < ["account", "bedrijf", "betaling"].indexOf(step)
                    ? "bg-yelk-100 text-yelk-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < ["account", "bedrijf", "betaling"].indexOf(step) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium capitalize hidden sm:block ${step === s ? "text-slate-900" : "text-slate-400"}`}>
                {s === "account" ? "Account" : s === "bedrijf" ? "Bedrijf" : "Betaling"}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-slate-200" />}
            </div>
          ))}
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {step === "account" && "Uw accountgegevens"}
          {step === "bedrijf" && "Bedrijfsinformatie"}
          {step === "betaling" && "Bestelling bevestigen"}
        </h1>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "account" && (
            <>
              <div>
                <label className="label">Volledige naam</label>
                <input className="input" type="text" placeholder="Jan de Vries" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
              </div>
              <div>
                <label className="label">E-mailadres</label>
                <input className="input" type="email" placeholder="jan@bedrijf.nl" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
              <div>
                <label className="label">Wachtwoord</label>
                <div className="relative">
                  <input className="input pr-10" type={showPassword ? "text" : "password"} placeholder="Minimaal 8 tekens" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "bedrijf" && (
            <>
              <div>
                <label className="label">Bedrijfsnaam</label>
                <input className="input" type="text" placeholder="Mijn BV" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} required />
              </div>
              <div>
                <label className="label">KvK-nummer</label>
                <input className="input" type="text" placeholder="12345678" value={form.kvk_number} onChange={(e) => update("kvk_number", e.target.value)} />
              </div>
              <div>
                <label className="label">BTW-nummer</label>
                <input className="input" type="text" placeholder="NL000000000B01" value={form.vat_number} onChange={(e) => update("vat_number", e.target.value)} />
              </div>
              <div>
                <label className="label">Telefoonnummer</label>
                <input className="input" type="tel" placeholder="+31 6 00000000" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </>
          )}

          {step === "betaling" && (
            <div className="space-y-4">
              <div>
                <label className="label">Pakket</label>
                <select className="input" value={form.plan} onChange={(e) => update("plan", e.target.value)}>
                  <option value="start">Yelk Start — €99/mnd</option>
                  <option value="groei">Yelk Groei — €150/mnd</option>
                  <option value="pro">Yelk E-commerce — €199/mnd</option>
                </select>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Eerste maand ({plan.label})</span>
                  <span className="font-medium">{formatCurrency(plan.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Eenmalige opstartkosten</span>
                  <span className="font-medium">{formatCurrency(plan.setup)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                  <span>Totaal vandaag</span>
                  <span className="text-yelk-600">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Daarna {formatCurrency(plan.price)}/maand. Maandelijks opzegbaar.
                </p>
              </div>

              <p className="text-xs text-slate-500">
                U wordt doorgestuurd naar de beveiligde betaalpagina van Mollie
                om te betalen via iDEAL, creditcard of SEPA-incasso.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step !== "account" && (
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setStep(step === "betaling" ? "bedrijf" : "account")}
              >
                Terug
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === "betaling" ? (
                "Afrekenen via Mollie →"
              ) : (
                "Volgende →"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Al een account?{" "}
          <Link href="/login" className="text-yelk-600 font-medium hover:text-yelk-700">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
