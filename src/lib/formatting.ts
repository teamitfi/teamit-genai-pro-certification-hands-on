export function formatRenewalDate(iso: string | null): string {
  if (!iso) return "unknown";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeDays(iso: string | null): string {
  if (!iso) return "—";
  const target = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.round((target - now) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days > 0) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}
