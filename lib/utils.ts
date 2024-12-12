import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number | string | null) {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

export function formatPercentage(value: number | string | null) {
  if (!value) return "-";
  return `${Number(value).toFixed(1)}%`;
}

export function formatNumber(value: number | string | null, decimals = 1) {
  if (!value) return "-";
  return Number(value).toFixed(decimals);
}
