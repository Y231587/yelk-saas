import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalHeader } from "@/components/portal/header";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <PortalSidebar profile={profile} customer={customer} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader profile={profile} customer={customer} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
