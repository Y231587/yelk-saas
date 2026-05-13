import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDatetime } from "@/lib/utils";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { MarkAllReadButton } from "@/components/portal/mark-all-read";

export default async function NotificatiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const kindIcon = (kind: string) => {
    switch (kind) {
      case "warning": return AlertTriangle;
      case "error": return XCircle;
      case "success": return CheckCircle2;
      default: return Info;
    }
  };

  const kindColor = (kind: string) => {
    switch (kind) {
      case "warning": return "text-amber-500 bg-amber-50";
      case "error": return "text-red-500 bg-red-50";
      case "success": return "text-yelk-500 bg-yelk-50";
      default: return "text-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificaties</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} ongelezen melding${unreadCount > 1 ? "en" : ""}` : "Alles gelezen"}
          </p>
        </div>
        {unreadCount > 0 && (
          <MarkAllReadButton userId={user.id} />
        )}
      </div>

      <div className="card divide-y divide-slate-100">
        {(notifications ?? []).length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Geen meldingen</p>
          </div>
        ) : (notifications ?? []).map((n) => {
          const Icon = kindIcon(n.kind);
          return (
            <div key={n.id} className={`px-6 py-4 flex items-start gap-4 ${!n.read ? "bg-yelk-50/30" : ""}`}>
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${kindColor(n.kind)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${!n.read ? "text-slate-900" : "text-slate-700"}`}>
                  {n.title}
                  {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-yelk-500" />}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">{n.message}</div>
                <div className="text-xs text-slate-400 mt-1">{formatDatetime(n.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
