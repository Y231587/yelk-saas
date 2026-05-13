import type { Metadata } from "next";
import { Shield, Users, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Over ons",
  description: "Meer over Yelk Finance en ons team.",
};

export default function OverOnsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-20 text-white text-center">
        <div className="page-container max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Over Yelk Finance</h1>
          <p className="text-lg text-slate-400">
            Wij helpen Nederlandse ondernemers met slimme, toegankelijke boekhoudsoftware.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="page-container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Onze missie</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Yelk Finance is opgericht met één doel: boekhouding begrijpelijk en betaalbaar maken
                voor elke ondernemer in Nederland. Of u nu ZZP'er bent of een groeiend bedrijf runt,
                wij zorgen dat uw administratie altijd klopt.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Ons platform combineert slimme technologie met persoonlijke service vanuit Nederland.
                Wij geloven in transparantie, veiligheid en echte klantondersteuning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="card p-5">
                  <v.icon className="h-6 w-6 text-yelk-500 mb-3" />
                  <div className="text-sm font-semibold text-slate-900 mb-1">{v.title}</div>
                  <div className="text-xs text-slate-500">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="page-container max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Onze cijfers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            {[
              { value: "100+", label: "Klanten" },
              { value: "99.9%", label: "Uptime" },
              { value: "AVG", label: "Compliant" },
              { value: "NL", label: "Support" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-yelk-600">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const values = [
  { icon: Shield, title: "Veiligheid", desc: "AVG-compliant, versleuteld opgeslagen in NL datacenters." },
  { icon: Users, title: "Persoonlijk", desc: "Nederlandse klantenservice, altijd bereikbaar." },
  { icon: Zap, title: "Snel", desc: "Moderne technologie voor een vlekkeloze ervaring." },
  { icon: Heart, title: "Transparant", desc: "Eerlijke prijzen, geen verborgen kosten." },
];
