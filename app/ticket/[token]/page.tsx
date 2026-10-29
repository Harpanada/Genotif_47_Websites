import DownloadTicketButton from "@/app/ticket/[token]/DownloadTicketButton";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/src/prisma/db";
import Image from "next/image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TicketPageProps = {
  params: Promise<{ token: string }>;
};

const competitionNames: Record<string, string> = {
  FUN_RUN: "Fun Run",
  STMS: "Smancir Talent Mini Show",
  CERDAS_CERMAT: "Cerdas Cermat",
  MEWARNAI: "Lomba Mewarnai",
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { token } = await params;

  if (!/^[a-f0-9]{64}$/.test(token)) notFound();

  const registration = await db.orm.public.DataLomba.where({
    ticketToken: token,
  }).first();

  if (!registration || registration.statusBayar !== "PAID") {
    notFound();
  }

  let participantName = "";
  let category = "";
  let details: string[] = [];
  let members: string[] = [];
  let contact = "";

  switch (registration.jenisLomba) {
    case "FUN_RUN": {
      const data = await db.orm.public.DetailFunRun.where({
        dataLombaId: registration.id,
      }).first();

      if (!data) notFound();

      participantName = data.namaLengkap;
      category = "Peserta Individu";
      contact = data.noWhatsapp;
      details = [
        `Jenis Kelamin: ${data.jenisKelamin}`,
        `Kontak Darurat: ${data.kontakDarurat}`,
      ];
      break;
    }

    case "STMS": {
      const data = await db.orm.public.DetailSTMS.where({
        dataLombaId: registration.id,
      }).first();

      if (!data) notFound();

      participantName = data.namaPerwakilan;
      category = "Talent Show";
      contact = data.noWhatsapp;
      details = [
        `Kelas: ${data.kelas}`,
        `Jenis Bakat: ${data.jenisBakat}`,
        `Jumlah Anggota: ${data.jumlahAnggota}`,
      ];

      const rows = await db.orm.public.AnggotaSTMS.where({
        detailSTMSId: data.id,
      }).all();

      members = rows.map((member) => member.namaLengkap);
      break;
    }

    case "CERDAS_CERMAT": {
      const data = await db.orm.public.DetailCerdasCermat.where({
        dataLombaId: registration.id,
      }).first();

      if (!data) notFound();

      participantName = data.namaSekolah;
      category = "Cerdas Cermat";
      contact = data.whatsappPendamping;
      details = [
        `Guru Pendamping: ${data.namaGuruPendamping}`,
        `Alamat sekolah: ${data.alamatSekolah}`,
      ];

      const rows = await db.orm.public.AnggotaCerdasCermat.where({
        detailCerdasCermatId: data.id,
      }).all();

      members = rows.map(
        (member) => `${member.namaLengkap} — Kelas ${member.kelas}`,
      );
      break;
    }

    case "MEWARNAI": {
      const data = await db.orm.public.DetailMewarnai.where({
        dataLombaId: registration.id,
      }).first();

      if (!data) notFound();

      participantName = data.namaPeserta;
      category = `${data.paketLomba}`;
      contact = data.whatsappOrangTua;
      details = [
        `Orangtua/Wali: ${data.namaOrangTua}`,
        `Sekolah: ${data.asalSekolah}`,
        `Kelas: ${data.kelas}`,
        `Usia: ${data.usia} tahun`,
      ];
      break;
    }

    default:
      notFound();
  }

  const qrDataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 240,
  });

  const ticketId = registration.id.toUpperCase();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eef4f7] px-3 py-6 text-[#00354E] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 text-center sm:mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1686a5] sm:text-sm sm:tracking-[0.3em]">
            Genotif presents
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl">
            Your Event Pass
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Simpan tiket ini dan tunjukkan kepada panitia.
          </p>
        </header>

        <article className="w-full overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
          {/* Header tiket */}
          <div className="bg-[#00354E] px-4 py-4 text-white sm:px-7 sm:py-5 lg:px-9">
            <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:gap-5 sm:text-left">
              <Image
                width={70}
                height={70}
                alt="Logo Genotif 47"
                src="/icon/g47LogoWhitoutBr.png"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-17.5 lg:w-17.5"
                priority
              />

              <h2 className="min-w-0 wrap-break-word text-2xl font-black font-['Telma-Medium'] text-[#f0ac2d] sm:text-right sm:text-3xl lg:text-4xl">
                {competitionNames[registration.jenisLomba] ??
                  registration.jenisLomba}
              </h2>
            </div>
          </div>

          {/* Isi tiket */}
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px]">
            <section className="min-w-0 p-4 sm:p-6 lg:p-9">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-['body-bold'] sm:text-sm lg:text-lg">
                {registration.jenisLomba === "CERDAS_CERMAT"
                  ? "Nama Sekolah"
                  : registration.jenisLomba === "STMS" || members.length > 1
                    ? "Perwakilan / Ketua Tim"
                    : "Nama Peserta"}
              </p>

              <h3 className="mt-2 wrap-break-word text-2xl font-black font-['Telma-Medium'] sm:text-3xl lg:text-4xl">
                {participantName}
              </h3>

              {/* Detail menjadi satu kolom di HP,
                  dua kolom di tablet, tiga kolom di desktop */}
              <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-6 lg:grid-cols-3 lg:gap-5">
                <div className="flex min-w-0 flex-col gap-4 font-['body-bold']">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 sm:text-base lg:text-lg">
                      ID Pendaftaran
                    </p>
                    <p className="mt-1 break-all text-sm font-bold sm:text-base">
                      {ticketId}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 sm:text-base lg:text-lg">
                      Kategori
                    </p>
                    <p className="mt-1 wrap-break-word text-sm font-semibold sm:text-base">
                      {category}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 sm:text-base lg:text-lg">
                      Kontak Terdaftar
                    </p>
                    <p className="mt-1 wrap-break-word text-sm font-medium sm:text-base">
                      {contact}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-2 font-['body-bold']">
                  <p className="text-base text-slate-500 sm:text-lg">
                    Detail Peserta
                  </p>

                  <div className="flex min-w-0 flex-col gap-2">
                    {details.map((detail, index) => (
                      <p
                        key={`${index}-${detail}`}
                        className="wrap-break-word text-sm font-medium sm:text-base">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>

                {members.length > 0 && (
                  <div className="flex min-w-0 flex-col gap-2 font-['body-bold'] sm:col-span-2 lg:col-span-1">
                    <p className="text-base font-bold text-slate-500 sm:text-lg">
                      Anggota Tim
                    </p>

                    <ol className="list-inside list-decimal space-y-1 wrap-break-word text-sm sm:text-base">
                      {members.map((member, index) => (
                        <li key={`${member}-${index}`}>{member}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>

            {/* Panel QR */}
            <aside className="flex min-w-0 flex-col items-center justify-center gap-3 border-t-2 border-dashed border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l-2 lg:border-t-0">
              <span className="rounded-full bg-[#F0AC2D] px-8 py-2 text-sm font-bold uppercase tracking-wider text-[#00354E] font-['body-bold']">
                PAID
              </span>

              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                {/* QR hanya berisi token tiket */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="QR code tiket Genotif"
                  width={200}
                  height={200}
                  className="h-40 w-40 sm:h-48 sm:w-48 lg:h-50 lg:w-50"
                />
              </div>

              <p className="text-center text-xs font-bold uppercase tracking-widest font-['body-bold']">
                Scan at entrance
              </p>
              <p className="max-w-xs text-center text-xs leading-5 text-slate-500 font-['body-bold']">
                Tunjukkan QR ini kepada panitia.
              </p>
            </aside>
          </div>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-between gap-2 bg-[#00354E] px-4 py-4 text-center text-white sm:flex-row sm:px-7 sm:text-left lg:px-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] font-['body-bold'] sm:text-xs sm:tracking-[0.2em]">
              Fantasy Beyond The Peak
            </p>
            <p className="text-xs font-['body-bold']">GENOTIF 47 | 2026</p>
          </footer>
        </article>
        <DownloadTicketButton token={token} />
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-slate-500">
          Tiket ini berlaku untuk pendaftaran yang pembayarannya telah
          terkonfirmasi. Jangan membagikan tautan tiket kepada orang lain.
        </p>
      </div>
    </main>
  );
}
