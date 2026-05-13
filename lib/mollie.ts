import type { PlanKey } from "@/types";

const MOLLIE_API_URL = "https://api.mollie.com/v2";

function mollieHeaders() {
  return {
    Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function createMolliePayment(params: {
  amount: number;
  description: string;
  customerId: string;
  planKey: PlanKey;
  redirectUrl: string;
  isFirst?: boolean;
}) {
  const { amount, description, customerId, planKey, redirectUrl, isFirst = true } = params;

  const body = {
    amount: {
      currency: "EUR",
      value: amount.toFixed(2),
    },
    description,
    redirectUrl,
    webhookUrl: process.env.MOLLIE_WEBHOOK_URL,
    metadata: {
      customer_id: customerId,
      plan_key: planKey,
      is_first: isFirst,
    },
    method: ["ideal", "creditcard", "directdebit"],
    locale: "nl_NL",
  };

  const res = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: "POST",
    headers: mollieHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Mollie error: ${JSON.stringify(error)}`);
  }

  return res.json() as Promise<MolliePayment>;
}

export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  const res = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    headers: mollieHeaders(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Mollie error: ${JSON.stringify(error)}`);
  }

  return res.json();
}

export async function createMollieSubscription(params: {
  mollieCustomerId: string;
  amount: number;
  description: string;
  planKey: PlanKey;
  appCustomerId: string;
}) {
  const { mollieCustomerId, amount, description, planKey, appCustomerId } = params;

  const body = {
    amount: {
      currency: "EUR",
      value: amount.toFixed(2),
    },
    interval: "1 month",
    description,
    webhookUrl: process.env.MOLLIE_WEBHOOK_URL,
    metadata: {
      plan_key: planKey,
      app_customer_id: appCustomerId,
    },
  };

  const res = await fetch(
    `${MOLLIE_API_URL}/customers/${mollieCustomerId}/subscriptions`,
    {
      method: "POST",
      headers: mollieHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Mollie subscription error: ${JSON.stringify(error)}`);
  }

  return res.json() as Promise<MollieSubscription>;
}

export async function createMollieCustomer(params: {
  name: string;
  email: string;
}) {
  const res = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: "POST",
    headers: mollieHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Mollie customer error: ${JSON.stringify(error)}`);
  }

  return res.json() as Promise<{ id: string; name: string; email: string }>;
}

// ─── Mollie API Types ─────────────────────────────────────────────────────────

export interface MolliePayment {
  id: string;
  status: "open" | "canceled" | "pending" | "authorized" | "expired" | "failed" | "paid";
  amount: { currency: string; value: string };
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata: Record<string, unknown>;
  _links: {
    checkout?: { href: string };
    self: { href: string };
  };
  createdAt: string;
  paidAt?: string;
  failedAt?: string;
  expiresAt?: string;
  method?: string;
}

export interface MollieSubscription {
  id: string;
  customerId: string;
  status: "pending" | "active" | "canceled" | "suspended" | "completed";
  amount: { currency: string; value: string };
  interval: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  nextPaymentDate?: string;
}
