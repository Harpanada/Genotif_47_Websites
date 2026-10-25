type DateValue =
  string | Date | { epochMilliseconds: number } | null | undefined;

export function formatTanggal(value: DateValue): string {
  if (value == null) return "—";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string") {
    date = new Date(value);
  } else {
    date = new Date(value.epochMilliseconds);
  }

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  })
    .format(date)
    .replace(",", ":");
}
