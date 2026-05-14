import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Upload,
  Bell,
  FileText,
  CheckCircle2,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PricingSection } from "@/components/marketing/pricing-section";
import type { Package } from "@/types";

export default async function HomePage() {
  let plans: Package[] = [];
  try {
    const supabase = await createClient();
    const { data: packages } = await supabase.from("packages").select("*").order("monthly_price_eur");
    plans = packages ?? [];
  } catch {
    // Supabase not configured — page renders without pricing plans
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-yelk-950 pt-32 pb-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yelk-900/40 via-transparent to-transparent" />
        <div className="page-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yelk-500/30 bg-yelk-500/10 px-4 py-1.5 text-sm font-medium text-yelk-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yelk-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yelk-500" />
              </span>
              Nu beschikbaar voor Nederlandse ondernemers
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Boekhouden{" "}
              <span className="bg-yelk-gradient bg-clip-text text-transparent">
                zonder zorgen
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Yelk Finance is uw moderne digitale boekhouder. Upload documenten,
              beheer facturen en houd uw administratie altijd up-to-date —
              eenvoudig en veilig.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                Aan de slag <ChevronRight className="h-5 w-5" />
              </Link>
              <Link href="/pricing" className="btn-secondary px-8 py-3.5 text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                Bekijk pakketten
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
              {["Geen opstartkosten", "Maandelijks opzegbaar", "Veilig & AVG-compliant", "NL support"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-yelk-400" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-20 mx-auto max-w-5xl">
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm p-1 shadow-2xl">
              <div className="rounded-xl bg-slate-900 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-yelk-400" />
                  <div className="ml-4 flex-1 rounded-md bg-slate-800 h-6" />
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Omzet (MTD)", value: "€ 12.450", color: "text-yelk-400" },
                    { label: "Facturen", value: "8 open", color: "text-amber-400" },
                    { label: "Documenten", value: "43 uploads", color: "text-blue-400" },
                    { label: "BTW kwartaal", value: "€ 2.612", color: "text-purple-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-slate-800 p-4">
                      <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-slate-800 flex items-end gap-1 px-4 pb-4">
                  {[40, 65, 45, 80, 60, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-yelk-500/40 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="functies" className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Alles wat u nodig heeft
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Van facturatie tot btw-aangifte — Yelk Finance heeft het allemaal
              inbegrepen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yelk-50">
                  <feature.icon className="h-6 w-6 text-yelk-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Vertrouwd door ondernemers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  &quot;{t.quote}&quot;
                </p>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pakketten" className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Kies uw pakket
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Transparante prijzen, geen verborgen kosten. Maandelijks opzegbaar.
            </p>
          </div>
          {plans.length > 0 ? (
            <PricingSection plans={plans} />
          ) : (
            <div className="text-center">
              <Link href="/pricing" className="btn-primary">
                Bekijk alle pakketten <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-yelk-gradient text-white">
        <div className="page-container text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg text-yelk-100 mb-10 max-w-xl mx-auto">
            Kies uw pakket en ga vandaag nog aan de slag. De eerste maand is
            inclusief gratis onboarding.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-yelk-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Gratis starten <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    icon: FileText,
    title: "Facturatie & klantenbeheer",
    description:
      "Maak en verstuur professionele facturen. Houd uw klanten en openstaande betalingen bij.",
  },
  {
    icon: Upload,
    title: "Document upload & OCR",
    description:
      "Upload bonnen en facturen eenvoudig via de app. Ons systeem verwerkt ze automatisch.",
  },
  {
    icon: BarChart3,
    title: "Financieel dashboard",
    description:
      "Altijd inzicht in uw omzet, kosten en btw-positie via een overzichtelijk dashboard.",
  },
  {
    icon: Bell,
    title: "Slimme meldingen",
    description:
      "Ontvang notificaties bij openstaande betalingen, deadlines en belangrijke updates.",
  },
  {
    icon: Shield,
    title: "AVG-compliant & veilig",
    description:
      "Uw data is veilig opgeslagen in Nederlandse datacenters. Volledig AVG-compliant.",
  },
  {
    icon: Zap,
    title: "Bankkoppelingen",
    description:
      "Koppel uw bankrekening en laat transacties automatisch verwerken in uw administratie.",
  },
];

const testimonials = [
  {
    quote:
      "Eindelijk een boekhoudoplossing die ik zelf begrijp. Mijn administratie is nu altijd up-to-date.",
    name: "Laura van den Berg",
    role: "ZZP'er, Grafisch ontwerper",
  },
  {
    quote:
      "De klantenservice is uitstekend en het systeem werkt foutloos. Sterk aanbevolen!",
    name: "Mark Jansen",
    role: "Eigenaar, Webbureau",
  },
  {
    quote:
      "Wat ik het fijnst vind is dat ik altijd inzicht heb in mijn financiën, ook onderweg.",
    name: "Sandra Hoekstra",
    role: "E-commerce ondernemer",
  },
];
