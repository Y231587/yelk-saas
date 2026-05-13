import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PricingCard } from "@/components/marketing/pricing-card";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Prijzen",
  description: "Kies het pakket dat bij uw onderneming past.",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase.from("packages").select("*");

  const plans = packages ?? [];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-20 text-white text-center">
        <div className="page-container">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Transparante prijzen,{" "}
            <span className="bg-yelk-gradient bg-clip-text text-transparent">
              geen verrassingen
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Kies het pakket dat past bij uw bedrijf. Maandelijks opzegbaar, geen
            verborgen kosten.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 bg-slate-50">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.key}
                plan={plan}
                highlighted={i === 1}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Alle pakketten hebben een eenmalige opstartvergoeding van €199.
              Daarna maandelijks opzegbaar.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="py-20 bg-white">
        <div className="page-container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            Altijd inbegrepen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inclusions.map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-yelk-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="py-16 bg-yelk-50">
        <div className="page-container text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Heeft u vragen over de pakketten?
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Bekijk onze veelgestelde vragen of neem direct contact op.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/faq" className="btn-secondary">Veelgestelde vragen</a>
            <a href="/contact" className="btn-primary">Contact opnemen</a>
          </div>
        </div>
      </section>
    </>
  );
}

const inclusions = [
  "Beveiligd klantenportaal",
  "Document upload & opslag",
  "Automatische btw-berekening",
  "Maandelijkse factuuroverzichten",
  "E-mail notificaties",
  "Mobiele app (PWA)",
  "Nederlandse klantenservice",
  "Data-export op aanvraag",
  "AVG-compliant dataverwerking",
  "Reguliere backups",
];
