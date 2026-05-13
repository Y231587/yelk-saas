import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDatetime(date: string | Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    actief: "Actief",
    proef: "Proefperiode",
    geannuleerd: "Geannuleerd",
    openstaand: "Openstaand",
    betaald: "Betaald",
    mislukt: "Mislukt",
    terugbetaald: "Terugbetaald",
    trialing: "Proef",
    active: "Actief",
    past_due: "Achterstallig",
    canceled: "Geannuleerd",
    incomplete: "Incompleet",
  };
  return labels[status] ?? status;
}

export function planLabel(key: string): string {
  const labels: Record<string, string> = {
    start: "Yelk Start",
    groei: "Yelk Groei",
    pro: "Yelk E-commerce",
  };
  return labels[key] ?? key;
}
