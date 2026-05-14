"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Er is iets misgegaan
      </h2>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        Er trad een fout op bij het laden van deze pagina. Probeer het opnieuw
        of neem contact op als het probleem aanhoudt.
      </p>
      <button onClick={reset} className="btn-primary">
        <RefreshCw className="h-4 w-4" />
        Opnieuw proberen
      </button>
    </div>
  );
}
