"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, User, Building2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfielPage() {
  const [tab, setTab] = useState<"account" | "bedrijf" | "wachtwoord">("account");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [customer, setCustomer] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
    vat_number: "",
    kvk_number: "",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const { data: c } = await supabase.from("customers").select("*").eq("owner_id", user.id).single();
      if (p) setProfile({ full_name: p.full_name ?? "", email: p.email });
      if (c) setCustomer({
        company_name: c.company_name,
        contact_name: c.contact_name ?? "",
        phone: c.phone ?? "",
        vat_number: c.vat_number ?? "",
        kvk_number: c.kvk_number ?? "",
      });
    })();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: profile.full_name }).eq("id", user.id);
    if (error) { toast.error("Opslaan mislukt."); } else { toast.success("Profiel bijgewerkt."); router.refresh(); }
    setLoading(false);
  }

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("customers").update(customer).eq("owner_id", user.id);
    if (error) { toast.error("Opslaan mislukt."); } else { toast.success("Bedrijfsgegevens bijgewerkt."); }
    setLoading(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error("Wachtwoorden komen niet overeen."); return; }
    if (passwords.new.length < 8) { toast.error("Wachtwoord moet minimaal 8 tekens zijn."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (error) { toast.error("Wachtwoord wijzigen mislukt."); } else { toast.success("Wachtwoord gewijzigd."); setPasswords({ current: "", new: "", confirm: "" }); }
    setLoading(false);
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "bedrijf", label: "Bedrijf", icon: Building2 },
    { id: "wachtwoord", label: "Wachtwoord", icon: Lock },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profiel instellingen</h1>
        <p className="text-slate-500 text-sm mt-1">Beheer uw account- en bedrijfsgegevens.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "account" && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Accountgegevens</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="label">Volledige naam</label>
              <input className="input" type="text" value={profile.full_name} onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))} />
            </div>
            <div>
              <label className="label">E-mailadres</label>
              <input className="input bg-slate-50 cursor-not-allowed" type="email" value={profile.email} disabled />
              <p className="text-xs text-slate-400 mt-1">E-mailadres kan niet worden gewijzigd.</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Opslaan</>}
            </button>
          </form>
        </div>
      )}

      {tab === "bedrijf" && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Bedrijfsgegevens</h2>
          <form onSubmit={saveCompany} className="space-y-4">
            <div>
              <label className="label">Bedrijfsnaam</label>
              <input className="input" type="text" value={customer.company_name} onChange={(e) => setCustomer(c => ({ ...c, company_name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Contactpersoon</label>
              <input className="input" type="text" value={customer.contact_name} onChange={(e) => setCustomer(c => ({ ...c, contact_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">KvK-nummer</label>
                <input className="input" type="text" value={customer.kvk_number} onChange={(e) => setCustomer(c => ({ ...c, kvk_number: e.target.value }))} />
              </div>
              <div>
                <label className="label">BTW-nummer</label>
                <input className="input" type="text" value={customer.vat_number} onChange={(e) => setCustomer(c => ({ ...c, vat_number: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Telefoonnummer</label>
              <input className="input" type="tel" value={customer.phone} onChange={(e) => setCustomer(c => ({ ...c, phone: e.target.value }))} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Opslaan</>}
            </button>
          </form>
        </div>
      )}

      {tab === "wachtwoord" && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Wachtwoord wijzigen</h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="label">Nieuw wachtwoord</label>
              <input className="input" type="password" placeholder="Minimaal 8 tekens" value={passwords.new} onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))} minLength={8} required />
            </div>
            <div>
              <label className="label">Wachtwoord bevestigen</label>
              <input className="input" type="password" placeholder="Herhaal nieuw wachtwoord" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-4 w-4" /> Wachtwoord wijzigen</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
