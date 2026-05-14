"use client";

import { useState } from "react";
import { ShoppingCart, X, ChevronRight, Trash2 } from "lucide-react";
import { PricingCard } from "./pricing-card";
import { formatCurrency } from "@/lib/utils";
import type { Package } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  plans: Package[];
}

export function PricingSection({ plans }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Package | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  function handleSelect(plan: Package) {
    setSelectedPlan(plan);
    setCartOpen(true);
  }

  function handleCheckout() {
    if (!selectedPlan) return;
    router.push(`/register?plan=${selectedPlan.key}`);
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <PricingCard
            key={plan.key}
            plan={plan}
            highlighted={i === 1}
            onSelect={handleSelect}
            selected={selectedPlan?.key === plan.key}
          />
        ))}
      </div>

      {/* Floating cart */}
      {cartOpen && selectedPlan && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="rounded-2xl border border-yelk-200 bg-white shadow-2xl shadow-yelk-500/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-50">
                  <ShoppingCart className="h-4 w-4 text-yelk-600" />
                </div>
                <span className="font-semibold text-slate-900">Uw winkelwagen</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Sluit winkelwagen"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-slate-900">{selectedPlan.name}</span>
                  <span className="text-slate-500 ml-1.5">eerste maand</span>
                </div>
                <span className="font-medium text-slate-900">
                  {formatCurrency(selectedPlan.monthly_price_eur)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Eenmalige opstartkosten</span>
                <span>{formatCurrency(selectedPlan.setup_fee_eur)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                <span className="text-slate-900">Totaal vandaag</span>
                <span className="text-yelk-600">
                  {formatCurrency(
                    selectedPlan.monthly_price_eur + selectedPlan.setup_fee_eur
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setCartOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Verwijder pakket"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={handleCheckout} className="btn-primary flex-1">
                Naar aanmelding <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3">
              Maandelijks opzegbaar · Veilig betalen via iDEAL &amp; creditcard
            </p>
          </div>
        </div>
      )}

      {/* Cart re-open button when cart is closed but plan selected */}
      {!cartOpen && selectedPlan && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-yelk-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-yelk-700 transition-all"
        >
          <ShoppingCart className="h-4 w-4" />
          {selectedPlan.name}
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">1</span>
        </button>
      )}
    </div>
  );
}
