"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Wachtwoorden komen niet overeen."); return; }
    if (password.length < 8) { toast.error("Minimaal 8 tekens vereist."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Wachtwoord instellen mislukt. Probeer de link opnieuw.");
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-yelk-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Wachtwoord ingesteld!</h1>
          <p className="text-sm text-slate-500">U wordt doorgestuurd naar uw dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yelk-50 mx-auto mb-4">
            <Lock className="h-6 w-6 text-yelk-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nieuw wachtwoord</h1>
          <p className="text-sm text-slate-500 mt-1">Kies een sterk nieuw wachtwoord.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="label">Nieuw wachtwoord</label>
            <input className="input" type="password" placeholder="Minimaal 8 tekens" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <div>
            <label className="label">Bevestig wachtwoord</label>
            <input className="input" type="password" placeholder="Herhaal uw wachtwoord" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Wachtwoord instellen"}
          </button>
        </form>
      </div>
    </div>
  );
}
