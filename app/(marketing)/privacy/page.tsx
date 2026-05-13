import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacybeleid" };

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-16 text-white text-center">
        <div className="page-container">
          <h1 className="text-4xl font-bold mb-2">Privacybeleid</h1>
          <p className="text-slate-400">Laatst bijgewerkt: mei 2025</p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="page-container max-w-3xl prose prose-slate">
          <div className="space-y-8 text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Verwerkingsverantwoordelijke</h2>
              <p className="text-sm leading-relaxed">Yelk Finance (hierna: "wij", "ons" of "Yelk Finance") is de verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens zoals beschreven in dit privacybeleid.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Welke gegevens verzamelen wij?</h2>
              <p className="text-sm leading-relaxed mb-2">Wij verwerken de volgende persoonsgegevens:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-slate-600">
                <li>Naam en contactgegevens (e-mailadres, telefoonnummer)</li>
                <li>Bedrijfsinformatie (KvK-nummer, BTW-nummer, bedrijfsnaam)</li>
                <li>Financiële gegevens voor facturatie en abonnementsbeheer</li>
                <li>Geüploade documenten (bonnen, facturen, bankafschriften)</li>
                <li>Inloggegevens en sessie-informatie</li>
                <li>Technische gegevens (IP-adres, browsertype)</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Grondslag en doel</h2>
              <p className="text-sm leading-relaxed">Wij verwerken uw gegevens op basis van: (a) uitvoering van een overeenkomst, (b) wettelijke verplichting, (c) gerechtvaardigd belang, of (d) uw toestemming. De gegevens worden gebruikt voor het leveren van onze diensten, facturatie, klantenservice en wettelijke verplichtingen.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Beveiliging</h2>
              <p className="text-sm leading-relaxed">Uw gegevens worden beveiligd opgeslagen in versleutelde EU-databases. Wij passen technische en organisatorische maatregelen toe om uw gegevens te beschermen tegen ongeautoriseerde toegang.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Uw rechten</h2>
              <p className="text-sm leading-relaxed">U heeft het recht op inzage, correctie, verwijdering, beperking en overdraagbaarheid van uw gegevens. Neem hiervoor contact op via info@yelkfinance.nl.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact</h2>
              <p className="text-sm leading-relaxed">Voor vragen over dit privacybeleid kunt u contact opnemen via <a href="mailto:info@yelkfinance.nl" className="text-yelk-600 underline">info@yelkfinance.nl</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
