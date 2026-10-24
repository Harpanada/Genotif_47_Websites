import { z } from "zod";

const nama = z.string().trim().min(1, "Field ini wajib diisi");
const email = z.string().trim().email("Format email tidak valid");
const whatsapp = z.string().trim().min(8, "Nomor WhatsApp terlalu pendek").max(20, "Nomor WhatsApp terlalu panjang");

const funRunSchema = z.object({
  jenisLomba: z.literal("FUN_RUN"),
  namaLengkap: nama,
  jenisKelamin: z.enum(["L", "P"]),
  kontakDarurat: whatsapp,
  email,
  noWhatsapp: whatsapp,
});

const stmsSchema = z.object({
  jenisLomba: z.literal("STMS"),
  namaPerwakilan: nama,
  kelas: nama,
  jenisBakat: nama,
  jumlahAnggota: z.number().int().min(1).max(10),
  anggota: z.array(z.object({ namaLengkap: nama })).max(9),
  menggunakanMusik: z.boolean(),
  perlengkapan: z.string().trim().max(1000).optional().default(""),
}).superRefine((data, ctx) => {
  if (data.anggota.length !== data.jumlahAnggota - 1) {
    ctx.addIssue({ code: "custom", path: ["anggota"], message: "Isi nama anggota tambahan sesuai jumlah anggota; perwakilan dihitung sebagai anggota pertama." });
  }
});

const cerdasCermatSchema = z.object({
  jenisLomba: z.literal("CERDAS_CERMAT"),
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
  namaPeserta: nama,
  asalSekolah: nama,
  kelas: z.enum(["1", "2", "3", "4", "5", "6"]),
  usia: z.number().int().min(1).max(18),
  namaOrangTua: nama,
  whatsappOrangTua: whatsapp,
  emailOrangTua: email,
  paketLomba: z.enum(["PAKET_A", "PAKET_B"]),
}).superRefine((data, ctx) => {
  if (data.paketLomba === "PAKET_A" && Number(data.kelas) > 3) {
    ctx.addIssue({ code: "custom", path: ["kelas"], message: "Paket A hanya untuk kelas 1–3 SD" });
  }
  if (data.paketLomba === "PAKET_B" && Number(data.kelas) < 4) {
    ctx.addIssue({ code: "custom", path: ["kelas"], message: "Paket B hanya untuk kelas 4–6 SD" });
  }
});

export const registrationSchema = z.discriminatedUnion("jenisLomba", [
  funRunSchema,
  stmsSchema,
  cerdasCermatSchema,
  mewarnaiSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;
