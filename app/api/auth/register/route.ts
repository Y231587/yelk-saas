import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createMolliePayment } from "@/lib/mollie";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  company_name: z.string().min(1),
  kvk_number: z.string().optional(),
  vat_number: z.string().optional(),
  phone: z.string().optional(),
  plan: z.enum(["start", "groei", "pro"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const supabase = await createAdminClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false,
      user_metadata: { full_name: data.full_name },
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes("already")) {
        return NextResponse.json({ error: "Dit e-mailadres is al in gebruik." }, { status: 409 });
      }
      return NextResponse.json({ error: authError?.message ?? "Registratie mislukt." }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Create profile
    await supabase.from("profiles").insert({
      id: userId,
      email: data.email,
      full_name: data.full_name,
      role: "klant",
    });

    // 3. Create customer record
    const { data: customer, error: custError } = await supabase
      .from("customers")
      .insert({
        owner_id: userId,
        company_name: data.company_name,
        contact_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
        vat_number: data.vat_number ?? null,
        kvk_number: data.kvk_number ?? null,
        status: "openstaand",
        payment_status: "openstaand",
      })
      .select()
      .single();

    if (custError || !customer) {
      return NextResponse.json({ error: "Klantprofiel aanmaken mislukt." }, { status: 500 });
    }

    // 4. Get package pricing
    const { data: pkg } = await supabase
      .from("packages")
      .select("*")
      .eq("key", data.plan)
      .single();

    if (!pkg) {
      return NextResponse.json({ error: "Onbekend pakket." }, { status: 400 });
    }

    // 5. Create Mollie payment (first payment includes setup fee)
    const amount = Number(pkg.monthly_price_eur) + Number(pkg.setup_fee_eur);

    let checkoutUrl: string | null = null;

    if (process.env.MOLLIE_API_KEY && process.env.MOLLIE_API_KEY !== "live_xxxx") {
      const payment = await createMolliePayment({
        amount,
        description: `${pkg.name} — eerste betaling incl. opstartkosten`,
        customerId: customer.id,
        planKey: data.plan,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/betaling/bevestiging?customer=${customer.id}`,
        isFirst: true,
      });
      checkoutUrl = payment._links.checkout?.href ?? null;
    }

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      checkoutUrl,
    });
  } catch (err: unknown) {
    console.error("[register]", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });
    }
    return NextResponse.json({ error: "Er is iets misgegaan." }, { status: 500 });
  }
}
