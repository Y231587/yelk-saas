import { NextRequest, NextResponse } from "next/server";
import { getMolliePayment } from "@/lib/mollie";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const paymentId = body.get("id") as string;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
    }

    // Fetch payment from Mollie
    const payment = await getMolliePayment(paymentId);
    const meta = payment.metadata as {
      customer_id?: string;
      plan_key?: string;
      is_first?: boolean;
    };

    if (!meta.customer_id || !meta.plan_key) {
      console.error("[webhook] Missing metadata in payment", payment);
      return NextResponse.json({ ok: true }); // Acknowledge
    }

    const supabase = await createAdminClient();
    const customerId = meta.customer_id;
    const planKey = meta.plan_key;

    if (payment.status === "paid") {
      // 1. Update customer to active
      await supabase
        .from("customers")
        .update({ status: "actief", payment_status: "betaald" })
        .eq("id", customerId);

      // 2. Upsert subscription
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("customer_id", customerId)
        .single();

      const nextPeriodEnd = new Date();
      nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

      if (existingSub) {
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_end: nextPeriodEnd.toISOString(),
            provider: "mollie",
            provider_subscription_id: paymentId,
          })
          .eq("id", existingSub.id);
      } else {
        await supabase.from("subscriptions").insert({
          customer_id: customerId,
          plan_key: planKey as "start" | "groei" | "pro",
          status: "active",
          provider: "mollie",
          provider_subscription_id: paymentId,
          current_period_end: nextPeriodEnd.toISOString(),
        });
      }

      // 3. Get owner for email confirmation
      const { data: customer } = await supabase
        .from("customers")
        .select("owner_id, email, company_name")
        .eq("id", customerId)
        .single();

      if (customer) {
        // Send email confirmation via Supabase auth (invite)
        await supabase.auth.admin.inviteUserByEmail(customer.email ?? "", {
          data: { company_name: customer.company_name },
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify`,
        });
      }

    } else if (payment.status === "failed" || payment.status === "expired") {
      // Mark payment as failed
      await supabase
        .from("customers")
        .update({ payment_status: "mislukt" })
        .eq("id", customerId);

      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("customer_id", customerId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[mollie-webhook]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// Mollie sends POST, not GET
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
