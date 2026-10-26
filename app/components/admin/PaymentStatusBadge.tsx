type PaymentStatusBadgeProps = {
  status: string | null | undefined;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",

  PAID: "bg-emerald-100 text-emerald-800",
  SETTLEMENT: "bg-emerald-100 text-emerald-800",
  CAPTURE: "bg-emerald-100 text-emerald-800",

  FAILED: "bg-red-100 text-red-700",
  CANCEL: "bg-red-100 text-red-700",
  DENY: "bg-red-100 text-red-700",

  EXPIRE: "bg-slate-100 text-slate-700",

  REFUNDED: "bg-purple-100 text-purple-800",
  REFUND: "bg-purple-100 text-purple-800",
  PARTIAL_REFUND: "bg-purple-100 text-purple-800",
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  const normalizedStatus = String(status ?? "UNKNOWN")
    .trim()
    .toUpperCase();

  const style = statusStyles[normalizedStatus] ?? "bg-slate-100 text-slate-600";

  const label = normalizedStatus.replaceAll("_", " ");

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
