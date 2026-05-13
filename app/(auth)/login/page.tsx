"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Onjuist e-mailadres of wachtwoord.");
      setLoading(false);
      return;
    }

    toast.success("Welkom terug!");
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Inloggen</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welkom terug bij Yelk Finance
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">E-mailadres</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="naam@bedrijf.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0" htmlFor="password">Wachtwoord</label>
              <Link
                href="/forgot-password"
                className="text-xs text-yelk-600 hover:text-yelk-700"
              >
                Vergeten?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Inloggen"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Nog geen account?{" "}
          <Link href="/register" className="text-yelk-600 font-medium hover:text-yelk-700">
            Registreren
          </Link>
        </p>
      </div>
    </div>
  );
}
