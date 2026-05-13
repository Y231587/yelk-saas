"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Upload,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile, Customer } from "@/types";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Abonnement", href: "/abonnement", icon: CreditCard },
  { label: "Facturen", href: "/facturen", icon: FileText },
  { label: "Documenten", href: "/documenten", icon: Upload },
  { label: "Notificaties", href: "/notificaties", icon: Bell },
  { label: "Profiel", href: "/profiel", icon: Settings },
];

interface Props {
  profile: Profile | null;
  customer: (Customer & { subscriptions: unknown[] }) | null;
}

export function PortalSidebar({ profile, customer }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-gradient">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Yelk <span className="text-yelk-500">Finance</span>
          </span>
        </Link>
      </div>

      {/* Customer badge */}
      {customer && (
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-yelk-50 border border-yelk-100">
          <div className="text-xs text-yelk-600 font-medium">{customer.company_name}</div>
          <div className={cn(
            "text-xs mt-0.5",
            customer.status === "actief" ? "text-yelk-500" :
            customer.payment_status === "mislukt" ? "text-red-500" :
            "text-amber-500"
          )}>
            {customer.status === "actief" ? "✓ Actief abonnement" :
             customer.payment_status === "mislukt" ? "⚠ Betaling mislukt" :
             "○ Openstaand"}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-yelk-50 text-yelk-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
            {pathname === item.href && (
              <ChevronRight className="h-3 w-3 ml-auto text-yelk-400" />
            )}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/profiel"
          className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yelk-500 text-white text-xs font-bold">
            {getInitials(profile?.full_name ?? profile?.email ?? "?")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {profile?.full_name ?? "Gebruiker"}
            </div>
            <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
