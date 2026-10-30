type DownloadTicketCardProps = {
  competitionName: string;
  participantLabel: string;
  participantName: string;
  ticketId: string;
  category: string;
  contact: string;
  details: string[];
  members: string[];
  qrDataUrl: string;
};

export default function DownloadTicketCard({
  competitionName,
  participantLabel,
  participantName,
  ticketId,
  category,
  contact,
  details,
  members,
  qrDataUrl,
}: DownloadTicketCardProps) {
  return (
    <article
      id="download-ticket-card"
      style={{
        width: 1200,
        height: 600,
        minWidth: 1200,
        maxWidth: 1200,
        boxSizing: "border-box",
        flexShrink: 0,
        fontFamily: "Arial, sans-serif",
      }}
      className="flex flex-col overflow-hidden rounded-xl bg-white text-[#00354E] shadow-xl ring-1 ring-slate-200">
      {/* Header tiket */}
      <header className="flex h-29 shrink-0 items-center justify-between gap-8 bg-[#00354E] px-9 py-5 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={70}
          height={70}
          alt="Logo Genotif 47"
          src="/icon/g47LogoWhitoutBr.png"
          className="h-17.5 w-17.5 shrink-0 object-contain"
        />

        <h2 className="min-w-0 flex-1 wrap-break-word text-right font-['Telma-Medium'] text-4xl font-black text-[#f0ac2d]">
          {competitionName}
        </h2>
      </header>

      {/* Isi tiket: detail di kiri, QR di kanan */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_240px]">
        <section className="min-w-0 p-9">
          <p className="font-['body-bold'] text-lg font-bold uppercase tracking-widest text-slate-500">
            {participantLabel}
          </p>

          <h3 className="mt-2 wrap-break-word font-['Telma-Medium'] text-4xl font-black">
            {participantName}
          </h3>

          {/* Detail peserta */}
          <div className="mt-6 grid min-w-0 grid-cols-3 gap-5">
            <div className="flex min-w-0 flex-col gap-4 font-['body-bold']">
              <div className="min-w-0">
                <p className="text-lg text-slate-500">ID Pendaftaran</p>
                <p className="mt-1 break-all text-sm font-bold">{ticketId}</p>
              </div>

              <div className="min-w-0">
                <p className="text-lg text-slate-500">Kategori</p>
                <p className="mt-1 wrap-break-word text-base font-semibold">
                  {category}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-lg text-slate-500">Kontak Terdaftar</p>
                <p className="mt-1 wrap-break-word text-base font-medium">
                  {contact}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2 font-['body-bold']">
              <p className="text-lg text-slate-500">Detail Peserta</p>

              <div className="flex min-w-0 flex-col gap-2">
                {details.map((detail, index) => (
                  <p
                    key={`${index}-${detail}`}
                    className="wrap-break-word text-base font-medium">
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            {members.length > 0 && (
              <div className="flex min-w-0 flex-col gap-2 font-['body-bold']">
                <p className="text-lg font-bold text-slate-500">Anggota Tim</p>

                <ol className="list-inside list-decimal space-y-1 wrap-break-word text-base">
                  {members.map((member, index) => (
                    <li key={`${member}-${index}`}>{member}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* Panel QR */}
        <aside className="flex min-w-0 flex-col items-center justify-center gap-3 border-l-2 border-dashed border-slate-200 bg-slate-50 p-5">
          <span className="rounded-full bg-[#F0AC2D] px-8 py-2 font-['body-bold'] text-sm font-bold uppercase tracking-wider text-[#00354E]">
            PAID
          </span>

          <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QR code tiket Genotif"
              width={200}
              height={200}
              className="h-50 w-50"
            />
          </div>

          <p className="font-['body-bold'] text-center text-xs font-bold uppercase tracking-widest">
            Scan at entrance
          </p>

          <p className="max-w-50 font-['body-bold'] text-center text-xs leading-5 text-slate-500">
            Tunjukkan QR ini kepada panitia.
          </p>
        </aside>
      </div>

      {/* Footer */}
      <footer className="flex h-13.5 shrink-0 items-center justify-between gap-4 bg-[#00354E] px-9 text-white">
        <p className="font-['body-bold'] text-xs font-bold uppercase tracking-[0.2em]">
          Fantasy Beyond The Peak
        </p>

        <p className="font-['body-bold'] text-xs">GENOTIF 47 | 2026</p>
      </footer>
    </article>
  );
}
