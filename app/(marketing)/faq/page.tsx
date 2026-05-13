"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Wat is inbegrepen in de opstartkosten?",
    a: "De eenmalige opstartkosten van €199 bevatten de onboarding, initiële accountinrichting, koppelingen instellen en een persoonlijk kennismakingsgesprek. Hierna betaalt u alleen het maandelijkse abonnementstarief.",
  },
  {
    q: "Kan ik mijn abonnement tussentijds opzeggen?",
    a: "Ja, alle abonnementen zijn maandelijks opzegbaar. U kunt opzeggen via e-mail of uw klantenportaal. Er zijn geen opzegtermijnen of boetes.",
  },
  {
    q: "Welke betaalmethoden accepteren jullie?",
    a: "Wij accepteren betalingen via iDEAL, SEPA-incasso en de meeste grote creditcards via ons beveiligde Mollie-betaalsysteem.",
  },
  {
    q: "Is mijn data veilig bij Yelk Finance?",
    a: "Absoluut. Uw data wordt versleuteld opgeslagen in EU-datacenters en wij zijn volledig AVG-compliant. Wij verstrekken nooit gegevens aan derden zonder uw toestemming.",
  },
  {
    q: "Kan ik ook op mijn telefoon inloggen?",
    a: "Ja. Yelk Finance is volledig mobiel-geoptimaliseerd. U kunt ons portaal ook als app installeren op uw smartphone via de PWA-functie in uw browser (Toevoegen aan beginscherm).",
  },
  {
    q: "Wat als ik van pakket wil wisselen?",
    a: "Stuur ons een bericht via het portaal of e-mail en wij regelen de overstap voor u. U wordt gefactureerd naar het nieuwe tarief per eerstvolgende factuurdatum.",
  },
  {
    q: "Hoe werkt het uploaden van documenten?",
    a: "In uw klantenportaal kunt u via drag & drop bonnen, facturen en bankafschriften uploaden. Wij verwerken de documenten en koppelen ze aan uw administratie.",
  },
  {
    q: "Hoelang duurt het voordat mijn account actief is?",
    a: "Na succesvolle betaling wordt uw account automatisch geactiveerd. U ontvangt een bevestigingsmail met inloggegevens en kunt direct aan de slag.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-20 text-white text-center">
        <div className="page-container">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Veelgestelde vragen</h1>
          <p className="text-lg text-slate-400">Antwoorden op de meest gestelde vragen.</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="page-container max-w-2xl">
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown className={cn("h-4 w-4 text-slate-400 flex-shrink-0 transition-transform", open === i && "rotate-180")} />
                </button>
                {open === i && (
                  <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-4">Staat uw vraag er niet bij?</p>
            <a href="/contact" className="btn-primary">Neem contact op</a>
          </div>
        </div>
      </section>
    </>
  );
}
