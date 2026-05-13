"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Upload,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Klanten", href: "/admin/klanten", icon: Users },
  { label: "Abonnementen", href: "/admin/abonnementen", icon: CreditCard },
  { label: "Betalingen", href: "/admin/betalingen", icon: FileText },
  { label: "Documenten", href: "/admin/documenten", icon: Upload },
  { label: "Statistieken", href: "/admin/statistieken", icon: BarChart3 },
];

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-gradient">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <div>
            <span className="font-bold text-base text-white">Yelk Finance</span>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-yelk-400" />
              <span className="text-xs text-yelk-400 font-medium">Admin</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-yelk-500/20 text-yelk-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yelk-500 text-white text-xs font-bold">
            {getInitials(profile.full_name ?? profile.email)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile.full_name ?? "Admin"}</div>
            <div className="text-xs text-slate-500 truncate">{profile.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
