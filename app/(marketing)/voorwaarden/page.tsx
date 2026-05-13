import type { Metadata } from "next";

export const metadata: Metadata = { title: "Algemene voorwaarden" };

export default function VoorwaardenPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-16 text-white text-center">
        <div className="page-container">
          <h1 className="text-4xl font-bold mb-2">Algemene voorwaarden</h1>
          <p className="text-slate-400">Versie 1.0 — Mei 2025</p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="page-container max-w-3xl">
          <div className="space-y-8 text-slate-700">
            {[
              { title: "1. Definities", body: "In deze voorwaarden wordt verstaan onder: \"Yelk Finance\": de dienstverlener; \"Klant\": de natuurlijke of rechtspersoon die gebruik maakt van de diensten; \"Diensten\": het digitale boekhoudplatform en aanverwante services." },
              { title: "2. Toepasselijkheid", body: "Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Yelk Finance en de Klant. Door gebruik te maken van onze diensten gaat u akkoord met deze voorwaarden." },
              { title: "3. Dienstverlening", body: "Yelk Finance levert een digitaal boekhoudplatform als SaaS-dienst. Wij streven naar een uptime van 99,9% maar kunnen geen absolute beschikbaarheidsgarantie bieden. Onderhoud wordt buiten kantooruren uitgevoerd." },
              { title: "4. Abonnement en betaling", body: "Abonnementen worden per maand vooraf gefactureerd. Bij niet-tijdige betaling kan de toegang tijdelijk worden opgeschort. Abonnementen kunnen maandelijks worden opgezegd met inachtneming van de lopende periode." },
              { title: "5. Aansprakelijkheid", body: "Yelk Finance is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst. Onze aansprakelijkheid is in alle gevallen beperkt tot het bedrag dat de klant in de afgelopen drie maanden heeft betaald." },
              { title: "6. Intellectueel eigendom", body: "Alle intellectuele eigendomsrechten op het platform en de software berusten bij Yelk Finance. De klant verkrijgt uitsluitend een gebruiksrecht gedurende de looptijd van het abonnement." },
              { title: "7. Vertrouwelijkheid", body: "Beide partijen behandelen elkaars vertrouwelijke informatie met de nodige zorgvuldigheid en verstrekken deze niet aan derden zonder voorafgaande schriftelijke toestemming." },
              { title: "8. Toepasselijk recht", body: "Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden bij uitsluiting voorgelegd aan de bevoegde rechter in Nederland." },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
                <p className="text-sm leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
