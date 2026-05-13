"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

export function AdminHeader({ profile }: { profile: Profile }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/admin/klanten?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="search"
          className="input pl-9 py-2 text-sm"
          placeholder="Zoek klant, bedrijf of e-mail..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-slate-500 hidden sm:block">
          {profile.full_name ?? profile.email}
        </span>
        <span className="badge-green text-xs">Admin</span>
      </div>
    </header>
  );
}
