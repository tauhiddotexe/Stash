const inr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** ₹1,250 / ₹12,500.50 — symbol belongs to the presentation layer only. */
export function formatINR(n: number): string {
  return "₹" + inr.format(n);
}

export function formatINRShort(n: number): string {
  if (n >= 1_000_000) return "₹" + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 100_000) return "₹" + (n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "L";
  if (n >= 1_000) return "₹" + (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
  return formatINR(n);
}