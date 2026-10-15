import { z } from "zod";

export const registerSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.email("Format email tidak valid"),
  noWhatsapp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  asalSekolah: z.string().min(2, "Asal sekolah wajib diisi"),
  jenisLomba: z.string().min(1, "Pilih jenis lomba"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
