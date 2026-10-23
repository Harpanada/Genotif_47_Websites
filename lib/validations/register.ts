import { z } from "zod";

// Data umum yang wajib ada untuk semua kategori.
const commonSchema = z.object({
  namaLengkap: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  email: z.email("Format email tidak valid"),
  noWhatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp terlalu pendek")
    .max(20, "Nomor WhatsApp terlalu panjang"),
});

// STMS: bisa solo atau berkelompok.
const stmsSchema = commonSchema
  .extend({
    jenisLomba: z.literal("STMS"),
    kelas: z.string().trim().min(1, "Kelas wajib diisi"),
    jenisBakat: z.string().trim().min(1, "Jenis bakat wajib diisi"),
    jumlahAnggota: z.number().int().min(1).max(10),
    anggota: z
      .array(
        z.object({
          namaLengkap: z.string().trim().min(1, "Nama anggota wajib diisi"),
        }),
      )
      .max(9),
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

// Cerdas Cermat: tepat 3 anggota.
const cerdasCermatSchema = commonSchema.extend({
  jenisLomba: z.literal("CERDAS_CERMAT"),
  namaSekolah: z.string().trim().min(1, "Nama sekolah wajib diisi"),
  alamatSekolah: z.string().trim().min(1, "Alamat sekolah wajib diisi"),
  namaGuruPendamping: z
    .string()
    .trim()
    .min(1, "Nama guru pendamping wajib diisi"),
  whatsappPendamping: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp pendamping tidak valid")
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

// Mewarnai: data anak dan orang tua/wali.
const mewarnaiSchema = commonSchema
  .extend({
    jenisLomba: z.literal("MEWARNAI"),
    asalSekolah: z.string().trim().min(1, "Asal sekolah wajib diisi"),
    kelas: z.enum(["1", "2", "3", "4", "5", "6"]),
    tanggalLahir: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
      .optional()
      .or(z.literal("")),
    usia: z.number().int().min(1).max(18).optional(),
    paketLomba: z.enum(["PAKET_A", "PAKET_B"]),
    namaOrangTua: z.string().trim().min(1, "Nama orang tua/wali wajib diisi"),
    whatsappOrangTua: z
      .string()
      .trim()
      .min(8, "Nomor WhatsApp orang tua tidak valid")
      .max(20, "Nomor WhatsApp orang tua terlalu panjang"),
  })
  .superRefine((data, ctx) => {
    const kelas = Number(data.kelas);

    if (data.paketLomba === "PAKET_A" && (kelas < 1 || kelas > 3)) {
      ctx.addIssue({
        code: "custom",
        path: ["kelas"],
        message: "Paket A hanya untuk kelas 1–3 SD",
      });
    }

    if (data.paketLomba === "PAKET_B" && (kelas < 4 || kelas > 6)) {
      ctx.addIssue({
        code: "custom",
        path: ["kelas"],
        message: "Paket B hanya untuk kelas 4–6 SD",
      });
    }

    if (!data.tanggalLahir && !data.usia) {
      ctx.addIssue({
        code: "custom",
        path: ["tanggalLahir"],
        message: "Tanggal lahir atau usia wajib diisi",
      });
    }

    if (data.tanggalLahir) {
      const date = new Date(`${data.tanggalLahir}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== data.tanggalLahir
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["tanggalLahir"],
          message: "Tanggal lahir tidak valid",
        });
      }
    }
  });

// Fun Run: hanya membutuhkan data umum.
const funRunSchema = commonSchema.extend({
  jenisLomba: z.literal("FUN_RUN"),
});

// Schema gabungan untuk semua kategori.
export const registrationSchema = z.discriminatedUnion("jenisLomba", [
  stmsSchema,
  cerdasCermatSchema,
  mewarnaiSchema,
  funRunSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;
