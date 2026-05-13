"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // In production: send to email API (Resend)
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    toast.success("Uw bericht is verzonden!");
  }

  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-32 pb-20 text-white text-center">
        <div className="page-container">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-slate-400">Heeft u een vraag? Wij helpen u graag.</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="page-container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Neem contact op</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Wij zijn bereikbaar op werkdagen van 09:00 – 17:30. Stuur een bericht en
                  wij reageren binnen één werkdag.
                </p>
              </div>
              <div className="space-y-4">
                <a href="mailto:info@yelkfinance.nl" className="flex items-center gap-3 text-slate-700 hover:text-yelk-600 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yelk-50">
                    <Mail className="h-4 w-4 text-yelk-600" />
                  </div>
                  info@yelkfinance.nl
                </a>
                <a href="tel:+31000000000" className="flex items-center gap-3 text-slate-700 hover:text-yelk-600 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yelk-50">
                    <Phone className="h-4 w-4 text-yelk-600" />
                  </div>
                  +31 (0)00 000 0000
                </a>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yelk-50">
                    <MapPin className="h-4 w-4 text-yelk-600" />
                  </div>
                  Nederland
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="card p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-yelk-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Bericht ontvangen!</h3>
                  <p className="text-sm text-slate-500">Wij nemen zo snel mogelijk contact met u op.</p>
                </div>
              ) : (
                <div className="card p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Naam</label>
                        <input className="input" type="text" placeholder="Jan de Vries" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="label">E-mailadres</label>
                        <input className="input" type="email" placeholder="jan@bedrijf.nl" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div>
                      <label className="label">Onderwerp</label>
                      <select className="input" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} required>
                        <option value="">Kies een onderwerp...</option>
                        <option value="algemeen">Algemene vraag</option>
                        <option value="pricing">Pakketten & prijzen</option>
                        <option value="support">Technische ondersteuning</option>
                        <option value="betaling">Betaling & facturen</option>
                        <option value="overig">Overig</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Bericht</label>
                      <textarea className="input min-h-[120px] resize-y" placeholder="Hoe kunnen wij u helpen?" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bericht versturen"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
