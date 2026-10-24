import { z } from "zod";

const nama = z.string().trim().min(1, "Nama wajib diisi");
const email = z.string().trim().email("Format email tidak valid");
const whatsapp = z.string().trim().min(8, "Nomor WhatsApp terlalu pendek").max(20, "Nomor WhatsApp terlalu panjang");

const funRunSchema = z.object({
  jenisLomba: z.literal("FUN_RUN"),
  namaLengkap: nama,
  email,
  noWhatsapp: whatsapp,
  jenisKelamin: z.enum(["L", "P"]),
  kontakDarurat: whatsapp,
});

const stmsSchema = z.object({
  jenisLomba: z.literal("STMS"),
  namaLengkap: nama, // Perwakilan dihitung sebagai anggota pertama.
  email,
  noWhatsapp: whatsapp,
  kelas: nama,
  jenisBakat: nama,
  jumlahAnggota: z.number().int().min(1).max(10),
  anggota: z.array(z.object({ namaLengkap: nama })).max(9),
  perlengkapan: z.string().trim().max(1000).optional().default(""),
  menggunakanMusik: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.anggota.length !== data.jumlahAnggota - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["anggota"],
      message: "Jumlah nama anggota tambahan harus sesuai. Perwakilan sudah dihitung sebagai anggota pertama.",
    });
  }
});

const cerdasCermatSchema = z.object({
  jenisLomba: z.literal("CERDAS_CERMAT"),
  namaLengkap: nama,
  email,
  noWhatsapp: whatsapp,
  namaSekolah: nama,
  alamatSekolah: nama,
  namaGuruPendamping: nama,
  emailPendamping: email,
  whatsappPendamping: whatsapp,
  anggota: z.array(z.object({
    namaLengkap: nama,
    kelas: z.enum(["4", "5", "6"]),
  })).length(3, "Cerdas Cermat harus memiliki tepat 3 anggota"),
});

const mewarnaiSchema = z.object({
  jenisLomba: z.literal("MEWARNAI"),
  namaLengkap: nama, // Nama anak
  email, // Email orang tua/wali sebagai kontak utama
  noWhatsapp: whatsapp, // WhatsApp orang tua/wali sebagai kontak utama
  asalSekolah: nama,
  kelas: z.enum(["1", "2", "3", "4", "5", "6"]),
  tanggalLahir: z.string().optional().default(""),
  usia: z.number().int().min(1).max(18).optional(),
  paketLomba: z.enum(["PAKET_A", "PAKET_B"]),
  namaOrangTua: nama,
  emailOrangTua: email,
  whatsappOrangTua: whatsapp,
}).superRefine((data, ctx) => {
  const kelas = Number(data.kelas);
  if (data.paketLomba === "PAKET_A" && kelas > 3) {
    ctx.addIssue({ code: "custom", path: ["kelas"], message: "Paket A hanya untuk kelas 1–3 SD" });
  }
  if (data.paketLomba === "PAKET_B" && kelas < 4) {
    ctx.addIssue({ code: "custom", path: ["kelas"], message: "Paket B hanya untuk kelas 4–6 SD" });
  }
  if (!data.tanggalLahir && data.usia === undefined) {
    ctx.addIssue({ code: "custom", path: ["tanggalLahir"], message: "Tanggal lahir atau usia wajib diisi" });
  }
  if (data.tanggalLahir) {
    const date = new Date(`${data.tanggalLahir}T00:00:00.000Z`);
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(data.tanggalLahir) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== data.tanggalLahir) {
      ctx.addIssue({ code: "custom", path: ["tanggalLahir"], message: "Tanggal lahir harus valid dengan format YYYY-MM-DD" });
    }
  }
});

export const registrationSchema = z.discriminatedUnion("jenisLomba", [
  funRunSchema,
  stmsSchema,
  cerdasCermatSchema,
  mewarnaiSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;
