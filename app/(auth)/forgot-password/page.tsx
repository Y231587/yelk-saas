"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("Er is een fout opgetreden. Controleer uw e-mailadres.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yelk-50 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-yelk-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">E-mail verzonden</h1>
          <p className="text-sm text-slate-500 mb-6">
            We hebben een herstellink gestuurd naar <strong>{email}</strong>.
            Controleer ook uw spammap.
          </p>
          <Link href="/login" className="btn-primary w-full">Terug naar inloggen</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yelk-50 mx-auto mb-4">
            <Mail className="h-6 w-6 text-yelk-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Wachtwoord vergeten?</h1>
          <p className="text-sm text-slate-500 mt-1">
            Vul uw e-mailadres in en wij sturen u een herstellink.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">E-mailadres</label>
            <input
              type="email"
              className="input"
              placeholder="naam@bedrijf.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Herstellink versturen"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="text-yelk-600 font-medium hover:text-yelk-700">
            ← Terug naar inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
