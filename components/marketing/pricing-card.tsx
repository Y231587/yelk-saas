"use client";

import { CheckCircle2, ChevronRight, ShoppingCart } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { Package } from "@/types";

interface PricingCardProps {
  plan: Package;
  highlighted?: boolean;
  selected?: boolean;
  onSelect?: (plan: Package) => void;
}

export function PricingCard({
  plan,
  highlighted = false,
  selected = false,
  onSelect,
}: PricingCardProps) {
  function handleClick() {
    if (onSelect) {
      onSelect(plan);
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 flex flex-col transition-all",
        highlighted
          ? "border-yelk-500 bg-slate-950 text-white shadow-2xl shadow-yelk-500/20 scale-105"
          : selected
          ? "border-yelk-400 bg-white text-slate-900 shadow-lg shadow-yelk-200/50 ring-2 ring-yelk-200"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-yelk-gradient px-4 py-1 text-xs font-semibold text-white">
            Meest gekozen
          </span>
        </div>
      )}

      {selected && !highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-yelk-500 px-3 py-0.5 text-xs font-semibold text-white">
            Geselecteerd
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={cn(
            "text-lg font-bold mb-1",
            highlighted ? "text-white" : "text-slate-900"
          )}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mt-4">
          <span
            className={cn(
              "text-4xl font-bold",
              highlighted ? "text-white" : "text-slate-900"
            )}
          >
            {formatCurrency(plan.monthly_price_eur)}
          </span>
          <span
            className={cn(
              "text-sm",
              highlighted ? "text-slate-400" : "text-slate-500"
            )}
          >
            / maand
          </span>
        </div>
        <p
          className={cn(
            "text-xs mt-1",
            highlighted ? "text-slate-400" : "text-slate-500"
          )}
        >
          + {formatCurrency(plan.setup_fee_eur)} eenmalige opstartkosten
        </p>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2
              className={cn(
                "h-4 w-4 flex-shrink-0 mt-0.5",
                highlighted ? "text-yelk-400" : "text-yelk-500"
              )}
            />
            <span
              className={cn(
                "text-sm",
                highlighted ? "text-slate-300" : "text-slate-600"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={cn(
          "w-full rounded-xl py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
          highlighted
            ? "bg-yelk-gradient text-white hover:opacity-90 shadow-lg"
            : selected
            ? "bg-yelk-50 border border-yelk-300 text-yelk-700 hover:bg-yelk-100"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        )}
      >
        {selected ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Geselecteerd
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> Kies {plan.name}{" "}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
