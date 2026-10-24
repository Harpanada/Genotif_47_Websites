type AdminHeaderProps = {
  title: string;
  description: string;
};

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <header className="mt-20 flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h1 className="text-xl font-bold text-[#00354E] sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00354E] text-sm font-bold text-white">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Administrator</p>
          <p className="text-xs text-slate-500">Admin Genotif</p>
        </div>
      </div>
    </header>
  );
}
