type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  accent?: string;
};

export default function StatCard({
  title,
  value,
  description,
  accent = "#30B5D8",
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className="mb-4 h-1 w-12 rounded-full"
        style={{ backgroundColor: accent }}
      />

      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-bold tracking-tight text-[#00354E]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}
