type PaymentStatusBadgeProps = {
  status: string | null | undefined;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  SETTLEMENT: "bg-emerald-100 text-emerald-800",
  CAPTURE: "bg-emerald-100 text-emerald-800",
  EXPIRE: "bg-slate-100 text-slate-700",
  CANCEL: "bg-red-100 text-red-700",
  DENY: "bg-red-100 text-red-700",
  REFUND: "bg-purple-100 text-purple-800",
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() ?? "UNKNOWN";

  const style = statusStyles[normalizedStatus] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {normalizedStatus}
    </span>
  );
}
