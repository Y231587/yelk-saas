"use client";

import { useState } from "react";
import { Menu, X, Bell, LogOut, LayoutDashboard, CreditCard, FileText, Upload, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import type { Profile, Customer } from "@/types";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Abonnement", href: "/abonnement", icon: CreditCard },
  { label: "Facturen", href: "/facturen", icon: FileText },
  { label: "Documenten", href: "/documenten", icon: Upload },
  { label: "Profiel", href: "/profiel", icon: Settings },
];

interface Props {
  profile: Profile | null;
  customer: Customer | null;
}

export function PortalHeader({ profile, customer }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:justify-end">
        {/* Mobile: logo */}
        <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-yelk-gradient">
            <span className="text-white font-bold text-xs">Y</span>
          </div>
          <span className="font-bold text-base text-slate-900">Yelk Finance</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/notificaties" className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-500" />
          </Link>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yelk-500 text-white text-xs font-bold">
            {getInitials(profile?.full_name ?? profile?.email ?? "?")}
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-gradient">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-bold text-lg text-slate-900">Yelk Finance</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {customer && (
            <div className="px-6 py-4 bg-yelk-50 border-b border-yelk-100">
              <div className="text-sm font-medium text-yelk-700">{customer.company_name}</div>
              <div className="text-xs text-slate-500">{profile?.email}</div>
            </div>
          )}

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === item.href
                    ? "bg-yelk-50 text-yelk-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Uitloggen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
