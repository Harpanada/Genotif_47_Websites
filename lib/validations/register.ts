import { z } from "zod";

// ============================================
// STMS
// ============================================

const stmsSchema = z
  .object({
    jenisLomba: z.literal("STMS"),

    namaPerwakilan: z.string().trim().min(1, "Nama perwakilan wajib diisi"),

    email: z.email("Format email tidak valid"),

    noWhatsapp: z
      .string()
      .trim()
      .min(8, "Nomor WhatsApp terlalu pendek")
      .max(20, "Nomor WhatsApp terlalu panjang"),

    kelas: z.string().trim().min(1, "Kelas wajib diisi"),

    jenisBakat: z.string().trim().min(1, "Jenis bakat wajib diisi"),

    jumlahAnggota: z.number().int().min(1).max(10),

    anggota: z
      .array(
        z.object({
          namaLengkap: z.string().trim().min(1, "Nama anggota wajib diisi"),
        }),
      )
      .max(9, "Maksimal 9 anggota tambahan"),

    perlengkapan: z.string().trim(),

    menggunakanMusik: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.anggota.length !== data.jumlahAnggota - 1) {
      ctx.addIssue({
        code: "custom",
        path: ["anggota"],
        message: "Jumlah nama anggota tidak sesuai jumlah tim.",
      });
    }
  });

// ============================================
// Cerdas Cermat
// ============================================

const cerdasCermatSchema = z.object({
  jenisLomba: z.literal("CERDAS_CERMAT"),

  namaSekolah: z.string().trim().min(1, "Nama sekolah wajib diisi"),

  alamatSekolah: z.string().trim().min(1, "Alamat sekolah wajib diisi"),

  namaGuruPendamping: z
    .string()
    .trim()
    .min(1, "Nama guru pendamping wajib diisi"),

  emailPendamping: z.email("Format email guru pendamping tidak valid"),

  whatsappPendamping: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp pendamping terlalu pendek")
    .max(20, "Nomor WhatsApp pendamping terlalu panjang"),

  anggota: z
    .array(
      z.object({
        namaLengkap: z.string().trim().min(1, "Nama anggota wajib diisi"),

        kelas: z.enum(["4", "5", "6"]),
      }),
    )
    .length(3, "Cerdas Cermat harus memiliki tepat 3 anggota"),
});

// ============================================
// Mewarnai
// ============================================

const mewarnaiSchema = z
  .object({
    jenisLomba: z.literal("MEWARNAI"),

    namaPeserta: z.string().trim().min(1, "Nama peserta wajib diisi"),

    asalSekolah: z.string().trim().min(1, "Asal sekolah wajib diisi"),

    kelas: z.number().int().min(1).max(6),

    usia: z.number().int().min(1).max(18),

    namaOrangTua: z.string().trim().min(1, "Nama orang tua/wali wajib diisi"),

    whatsappOrangTua: z
      .string()
      .trim()
      .min(8, "Nomor WhatsApp orang tua terlalu pendek")
      .max(20, "Nomor WhatsApp orang tua terlalu panjang"),

    emailOrangTua: z.email("Format email orang tua/wali tidak valid"),

    paketLomba: z.enum(["PAKET_A", "PAKET_B"]),
  })
  .superRefine((data, ctx) => {
    if (data.paketLomba === "PAKET_A" && (data.kelas < 1 || data.kelas > 3)) {
      ctx.addIssue({
        code: "custom",
        path: ["kelas"],
        message: "Paket A hanya untuk kelas 1–3 SD",
      });
    }

    if (data.paketLomba === "PAKET_B" && (data.kelas < 4 || data.kelas > 6)) {
      ctx.addIssue({
        code: "custom",
        path: ["kelas"],
        message: "Paket B hanya untuk kelas 4–6 SD",
      });
    }
  });

// ============================================
// Fun Run
// ============================================

const funRunSchema = z.object({
  jenisLomba: z.literal("FUN_RUN"),

  namaLengkap: z.string().trim().min(1, "Nama lengkap wajib diisi"),

  jenisKelamin: z.enum(["L", "P"], {
    error: "Jenis kelamin wajib dipilih",
  }),

  kontakDarurat: z
    .string()
    .trim()
    .min(8, "Nomor kontak darurat terlalu pendek")
    .max(20, "Nomor kontak darurat terlalu panjang"),

  email: z.email("Format email tidak valid"),

  noWhatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp terlalu pendek")
    .max(20, "Nomor WhatsApp terlalu panjang"),
});

// ============================================
// Schema gabungan
// ============================================

export const registrationSchema = z.discriminatedUnion("jenisLomba", [
  stmsSchema,
  cerdasCermatSchema,
  mewarnaiSchema,
  funRunSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;
