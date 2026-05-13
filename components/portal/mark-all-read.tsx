"use client";

import { useState } from "react";
import { CheckCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function MarkAllReadButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function markAllRead() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      toast.error("Kon meldingen niet markeren.");
    } else {
      toast.success("Alle meldingen gelezen.");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button onClick={markAllRead} disabled={loading} className="btn-secondary text-sm">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
      Alles gelezen
    </button>
  );
}
