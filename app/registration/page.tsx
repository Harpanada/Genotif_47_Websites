"use client";
import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import { registrationSchema } from "@/lib/validations/register";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export interface LccAnggota {
  nama: string;
  kelas: string;
}

export interface RegistrationFormData {
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  jenisKelamin: "L" | "P";
  kontakDarurat: string;
  jenisLomba: "FUN_RUN" | "LCC_SD" | "TALENT_SHOW" | "MEWARNAI";

  // STMS
  kelasStms: string;
  jenisBakat: string;
  jumlahAnggotaStms: number;
  namaAnggotaStms: string[];
  alatPerlengkapan: string;
  butuhMusik: string;

  // LCC
  namaSekolah: string;
  alamatSekolah: string;
  namaGuruPendamping: string;
  noWaGuru: string;
  anggotaLcc: LccAnggota[];

  // Mewarnai
  asalSekolahMewarnai: string;
  kelasMewarnai: string;
  tglLahirUsiaMewarnai: string;
  paketMewarnai: "PAKET_A" | "PAKET_B";
  namaOrtuMewarnai: string;
  noWaOrtuMewarnai: string;
}

function parseTanggalAtauUsia(input: string): {
  tanggalLahir?: string;
  usia?: number;
} {
  const value = input.trim();

  // Format tanggal: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { tanggalLahir: value };
  }

  // Format tanggal: DD/MM/YYYY
  const dateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    return {
      tanggalLahir: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    };
  }

  // Format usia: "8", "8 tahun", "8 thn", atau "8 th"
  const ageMatch = value.match(/^(\d{1,2})(?:\s*(?:tahun|thn|th))?$/i);

  if (ageMatch) {
    return { usia: Number(ageMatch[1]) };
  }

  return {};
}
export default function Registration() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    namaLengkap: "",
    email: "",
    noWhatsapp: "",
    jenisKelamin: "L",
    kontakDarurat: "",
    jenisLomba: "FUN_RUN",

    kelasStms: "",
    jenisBakat: "",
    jumlahAnggotaStms: 1,
    namaAnggotaStms: [],
    alatPerlengkapan: "",
    butuhMusik: "Tidak",

    namaSekolah: "",
    alamatSekolah: "",
    namaGuruPendamping: "",
    noWaGuru: "",
    anggotaLcc: [
      { nama: "", kelas: "4" },
      { nama: "", kelas: "4" },
      { nama: "", kelas: "4" },
    ],

    asalSekolahMewarnai: "",
    kelasMewarnai: "",
    tglLahirUsiaMewarnai: "",
    paketMewarnai: "PAKET_A",
    namaOrtuMewarnai: "",
    noWaOrtuMewarnai: "",
  });

  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [responseMsg, setResponseMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleJenisLombaChange = (
    jenisLomba: RegistrationFormData["jenisLomba"],
  ) => {
    setFormData((prev) => ({
      ...prev,
      jenisLomba,
    }));

    setFieldErrors({});
    setResponseMsg(null);
  };
  const handleJumlahAnggotaStmsChange = (jumlah: number) => {
    const total = Math.max(1, Math.min(10, Math.floor(jumlah)));

    setFormData((prev) => ({
      ...prev,
      jumlahAnggotaStms: total,
      namaAnggotaStms: Array.from(
        { length: total - 1 },
        (_, index) => prev.namaAnggotaStms[index] ?? "",
      ),
    }));

    setFieldErrors({});
  };

  const handleAnggotaStmsChange = (index: number, nama: string) => {
    setFormData((prev) => {
      const anggota = [...prev.namaAnggotaStms];
      anggota[index] = nama;

      return {
        ...prev,
        namaAnggotaStms: anggota,
      };
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`namaAnggotaStms.${index}`];
      delete next[`anggota.${index}.namaLengkap`];
      return next;
    });
  };

  const handleAnggotaLccChange = (
    index: number,
    field: keyof LccAnggota,
    value: string,
  ) => {
    setFormData((prev) => {
      const anggota = [...prev.anggotaLcc];

      anggota[index] = {
        ...anggota[index],
        [field]: value,
      };

      return {
        ...prev,
        anggotaLcc: anggota,
      };
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`anggotaLcc.${index}.${field}`];
      return next;
    });
  };
  const buildRegistrationPayload = () => {
    const common = {
      namaLengkap: formData.namaLengkap.trim(),
      email: formData.email.trim(),
      noWhatsapp: formData.noWhatsapp.trim(),
    };

    switch (formData.jenisLomba) {
      case "FUN_RUN":
        return {
          ...common,
          jenisLomba: "FUN_RUN" as const,
          jenisKelamin: formData.jenisKelamin,
          kontakDarurat: formData.kontakDarurat.trim(),
        };

      case "LCC_SD":
        return {
          ...common,
          jenisLomba: "CERDAS_CERMAT" as const,
          namaSekolah: formData.namaSekolah.trim(),
          alamatSekolah: formData.alamatSekolah.trim(),
          namaGuruPendamping: formData.namaGuruPendamping.trim(),
          emailPendamping: formData.email.trim(),
          whatsappPendamping: formData.noWaGuru.trim(),
          anggota: formData.anggotaLcc.map((anggota) => ({
            namaLengkap: anggota.nama.trim(),
            kelas: anggota.kelas,
          })),
        };

      case "TALENT_SHOW":
        return {
          ...common,
          jenisLomba: "STMS" as const,
          kelas: formData.kelasStms.trim(),
          jenisBakat: formData.jenisBakat.trim(),
          jumlahAnggota: Number(formData.jumlahAnggotaStms),
          anggota: formData.namaAnggotaStms.map((nama) => ({
            namaLengkap: nama.trim(),
          })),
          perlengkapan: formData.alatPerlengkapan.trim(),
          menggunakanMusik: formData.butuhMusik === "Ya",
        };

      case "MEWARNAI": {
        const tanggalUsia = parseTanggalAtauUsia(formData.tglLahirUsiaMewarnai);

        const kelas = formData.kelasMewarnai.match(/\d+/)?.[0] ?? "";

        return {
          ...common,
          jenisLomba: "MEWARNAI" as const,
          asalSekolah: formData.asalSekolahMewarnai.trim(),
          kelas,
          ...tanggalUsia,
          paketLomba: formData.paketMewarnai,
          namaOrangTua: formData.namaOrtuMewarnai.trim(),
          emailOrangTua: formData.email.trim(),
          whatsappOrangTua: formData.noWaOrtuMewarnai.trim(),
        };
      }
    }
  };
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setFieldErrors({});
    setResponseMsg(null);

    try {
      const payload = buildRegistrationPayload();
      const validation = registrationSchema.safeParse(payload);

      if (!validation.success) {
        const errors: Record<string, string> = {};

        for (const issue of validation.error.issues) {
          const path = issue.path.map(String).join(".");
          let uiPath = path;

          // Mapping error schema ke nama field pada UI.
          if (path === "kelas" && formData.jenisLomba === "TALENT_SHOW") {
            uiPath = "kelasStms";
          } else if (path === "kelas" && formData.jenisLomba === "MEWARNAI") {
            uiPath = "kelasMewarnai";
          } else if (path === "jumlahAnggota") {
            uiPath = "jumlahAnggotaStms";
          } else if (path === "perlengkapan") {
            uiPath = "alatPerlengkapan";
          } else if (path === "menggunakanMusik") {
            uiPath = "butuhMusik";
          } else if (path === "whatsappPendamping") {
            uiPath = "noWaGuru";
          } else if (path === "asalSekolah") {
            uiPath = "asalSekolahMewarnai";
          } else if (path === "paketLomba") {
            uiPath = "paketMewarnai";
          } else if (path === "tanggalLahir" || path === "usia") {
            uiPath = "tglLahirUsiaMewarnai";
          } else if (path === "namaOrangTua") {
            uiPath = "namaOrtuMewarnai";
          } else if (path === "whatsappOrangTua") {
            uiPath = "noWaOrtuMewarnai";
          } else {
            const lccMatch = path.match(
              /^anggota\.(\d+)\.(namaLengkap|kelas)$/,
            );

            const stmsMatch = path.match(/^anggota\.(\d+)\.namaLengkap$/);

            if (lccMatch && formData.jenisLomba === "LCC_SD") {
              uiPath = `anggotaLcc.${lccMatch[1]}.${
                lccMatch[2] === "namaLengkap" ? "nama" : "kelas"
              }`;
            } else if (stmsMatch && formData.jenisLomba === "TALENT_SHOW") {
              uiPath = `namaAnggotaStms.${stmsMatch[1]}`;
            } else if (path === "anggota") {
              uiPath =
                formData.jenisLomba === "LCC_SD"
                  ? "anggotaLcc"
                  : "namaAnggotaStms";
            }
          }

          errors[uiPath] ??= issue.message;
        }

        setFieldErrors(errors);
        setResponseMsg({
          type: "error",
          text: "Periksa kembali data pendaftaran yang belum valid.",
        });

        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result: {
        message?: string;
        error?: string;
        data?: { id?: string };
        issues?: Array<{
          path: (string | number)[];
          message: string;
        }>;
      } = await response.json();

      if (!response.ok) {
        if (result.issues) {
          const errors: Record<string, string> = {};

          for (const issue of result.issues) {
            const path = issue.path.map(String).join(".");
            errors[path] ??= issue.message;
          }

          setFieldErrors(errors);
        }

        throw new Error(
          result.error ?? result.message ?? "Gagal menyimpan pendaftaran.",
        );
      }

      setResponseMsg({
        type: "success",
        text: result.data?.id
          ? `Pendaftaran berhasil disimpan. ID: ${result.data.id}`
          : "Pendaftaran berhasil disimpan.",
      });

      console.log("Data pendaftaran tersimpan:", result.data);
    } catch (error: unknown) {
      setResponseMsg({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen brightness-95 bg-[url(/content/regist-hero.jpg)] bg-cover bg-center min-w-screen bg-no-repeat z-0 bg-fixed">
        <div className="min-h-screen backdrop-blur-sm p-6 flex flex-col text-center gap-14 items-center">
          <h1 className="mt-20 font-['Telma-Bold'] text-5xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3] md:text-6xl lg:text-8xl">
            Pra-Event Registration
          </h1>

          <form
            className="flex flex-col gap-3 w-full max-w-2xl justify-center items-center mb-20 px-2"
            onSubmit={handleSubmit}>
            {/* Notifikasi feedback */}
            {responseMsg && (
              <div
                className={`p-3 rounded text-sm w-full ${
                  responseMsg.type === "success"
                    ? "bg-green-500/20 text-green-300 border border-green-500"
                    : "bg-red-500/20 text-red-300 border border-red-500"
                }`}>
                {responseMsg.text}
              </div>
            )}

            {/* --- FIELD UMUM --- */}
            <div className="text-left flex flex-col w-full">
              <label className="w-full p-2 font-['body-medium'] text-[#00354E] text-shadow-sm font-bold">
                Nama Lengkap / Perwakilan
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full p-2.5 rounded-4xl font-['body-regular'] text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg"
              />
            </div>

            <div className="text-left flex flex-col w-full">
              <label className="w-full p-2 font-['body-medium'] text-[#00354E] text-shadow-sm font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@domain.com"
                className="w-full p-2.5 rounded-4xl font-['body-regular'] text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg"
              />
            </div>

            <div className="text-left flex flex-col w-full">
              <label className="w-full p-2 font-['body-medium'] text-[#00354E] text-shadow-sm font-bold">
                No Whatsapp
              </label>
              <input
                type="text"
                name="noWhatsapp"
                value={formData.noWhatsapp}
                onChange={handleChange}
                required
                placeholder="08xxxxxxxxxx"
                className="w-full p-2.5 rounded-4xl font-['body-regular'] text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg"
              />
            </div>

            <div className="text-left flex flex-col w-full">
              <label className="w-full p-2 font-['body-medium'] text-[#00354E] text-shadow-sm font-bold">
                Pilih Perlombaan
              </label>
              <select
                name="jenisLomba"
                value={formData.jenisLomba}
                onChange={handleChange}
                className="w-full p-2.5 rounded-4xl font-['body-regular'] text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg cursor-pointer">
                <option value="FUN_RUN">Fun Run 7K </option>
                <option value="LCC_SD">Lomba Cerdas Cermat SD</option>
                <option value="TALENT_SHOW">Smancir Talent Mini Show</option>
                <option value="MEWARNAI">Lomba Mewarnai & Menggambar SD</option>
              </select>
            </div>

            {formData.jenisLomba === "FUN_RUN" && (
              <motion.div key="fun-run" className="w-full flex flex-col gap-3 p-4 rounded-3xl bg-white/40 ring ring-[#30B5D8] text-left">
                <h3 className="font-bold text-[#00354E]">Data Fun Run</h3>
                <label className="text-sm font-bold text-[#00354E]">Jenis Kelamin</label>
                <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} required className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-[#00354E]">
                  <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                </select>
                <label className="text-sm font-bold text-[#00354E]">Nomor WhatsApp Kontak Darurat</label>
                <input name="kontakDarurat" value={formData.kontakDarurat} onChange={handleChange} required placeholder="08xxxxxxxxxx" className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-[#00354E]" />
                {fieldErrors.kontakDarurat && <p className="text-sm text-red-500">{fieldErrors.kontakDarurat}</p>}
              </motion.div>
            )}

            {/* --- DYNAMIC SUB-FORMS --- */}
            <AnimatePresence mode="wait">
              {/* 2. DYNAMIC FORM: LOMBA CERDAS CERMAT SD */}
              {formData.jenisLomba === "LCC_SD" && (
                <motion.div
                  key="lcc_sd"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col gap-3 my-2 p-4 rounded-3xl bg-white/40 backdrop-blur-md ring ring-[#30B5D8] text-left">
                  <h3 className="font-['body-bold'] text-[#00354E] text-sm underline decoration-[#f0ac2d]">
                    Identitas Sekolah & Tim (LCC SD)
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#00354E] p-1">
                      Nama Sekolah
                    </label>
                    <input
                      type="text"
                      name="namaSekolah"
                      placeholder="Contoh: SDN 1 Ciranjang"
                      value={formData.namaSekolah}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00354E] p-1">
                      Alamat Sekolah
                    </label>
                    <input
                      type="text"
                      name="alamatSekolah"
                      placeholder="Alamat Lengkap Sekolah"
                      value={formData.alamatSekolah}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Nama Guru Pendamping
                      </label>
                      <input
                        type="text"
                        name="namaGuruPendamping"
                        placeholder="Nama Guru & Gelar"
                        value={formData.namaGuruPendamping}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        WhatsApp Guru / Perwakilan
                      </label>
                      <input
                        type="text"
                        name="noWaGuru"
                        placeholder="08xxxxxxxxxx"
                        value={formData.noWaGuru}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-[#00354E] text-xs mt-2">
                    Data 3 Anggota Tim LCC:
                  </h4>
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/90 rounded-2xl ring ring-[#30B5D8]/40 flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#00354E]">
                        {idx === 0
                          ? "Anggota 1 (Ketua Tim)"
                          : `Anggota ${idx + 1}`}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Nama Lengkap Anggota"
                          required
                          value={formData.anggotaLcc[idx]?.nama || ""}
                          onChange={(e) =>
                            handleAnggotaLccChange(idx, "nama", e.target.value)
                          }
                          className="col-span-2 p-2 rounded-xl bg-white ring ring-[#30B5D8]/50 text-xs text-[#00354E]"
                        />
                        <select
                          value={formData.anggotaLcc[idx]?.kelas || "4"}
                          onChange={(e) =>
                            handleAnggotaLccChange(idx, "kelas", e.target.value)
                          }
                          className="p-2 rounded-xl bg-white ring ring-[#30B5D8]/50 text-xs text-[#00354E]">
                          <option value="4">Kelas 4</option>
                          <option value="5">Kelas 5</option>
                          <option value="6">Kelas 6</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 3. DYNAMIC FORM: SMANCIR TALENT MINI SHOW (STMS) */}
              {formData.jenisLomba === "TALENT_SHOW" && (
                <motion.div
                  key="stms"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col gap-3 my-2 p-4 rounded-3xl bg-white/40 backdrop-blur-md ring ring-[#30B5D8] text-left">
                  <h3 className="font-['body-bold'] text-[#00354E] text-sm underline decoration-[#f0ac2d]">
                    Detail Pendaftaran STMS (Mini Show)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Kelas Peserta
                      </label>
                      <input
                        type="text"
                        name="kelasStms"
                        placeholder="Contoh: XII-F2A"
                        value={formData.kelasStms}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Jenis Bakat
                      </label>
                      <input
                        type="text"
                        name="jenisBakat"
                        placeholder="Contoh: Band / Tari / Vocal"
                        value={formData.jenisBakat}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Jumlah Anggota (Jika Kelompok)
                      </label>
                      <input
                        id="jumlahAnggotaStms"
                        name="jumlahAnggotaStms"
                        type="number"
                        min={1}
                        max={10}
                        value={formData.jumlahAnggotaStms}
                        onChange={(e) =>
                          handleJumlahAnggotaStmsChange(
                            Number(e.target.value) || 1,
                          )
                        }
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                      {fieldErrors.jumlahAnggotaStms && (
                        <p className="text-sm text-red-500">
                          {fieldErrors.jumlahAnggotaStms}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                      <label className="text-xs font-bold text-[#00354E]">
                        Nama Anggota Kelompok (Opsional 1-9):
                      </label>
                      <p className="text-sm text-gray-500">
                        Peserta yang mendaftar dihitung sebagai anggota pertama.
                        Isi nama anggota lainnya di bawah.
                      </p>
                      {formData.namaAnggotaStms.map((nama, index) => (
                        <div key={index}>
                          <label htmlFor={`anggota-stms-${index}`}>
                            Anggota {index + 2}
                          </label>

                          <input
                            id={`anggota-stms-${index}`}
                            type="text"
                            value={nama}
                            onChange={(e) =>
                              handleAnggotaStmsChange(index, e.target.value)
                            }
                            placeholder={`Nama anggota ${index + 2}`}
                            required
                            className="w-full rounded-lg border p-3"
                          />

                          {fieldErrors[`namaAnggotaStms.${index}`] && (
                            <p className="text-sm text-red-500">
                              {fieldErrors[`namaAnggotaStms.${index}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Musik Pengiring?
                      </label>
                      <select
                        name="butuhMusik"
                        value={formData.butuhMusik}
                        onChange={handleChange}
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]">
                        <option value="Tidak">Tidak Membutuhkan</option>
                        <option value="Ya">Ya, Membutuhkan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00354E] p-1">
                      Alat / Perlengkapan yang Dibutuhkan
                    </label>
                    <textarea
                      name="alatPerlengkapan"
                      rows={2}
                      placeholder="Contoh: 2 Stand Mic, 1 Cable Jack Gitar"
                      value={formData.alatPerlengkapan}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-2xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                    />
                  </div>
                </motion.div>
              )}

              {/* 4. DYNAMIC FORM: LOMBA MEWARNAI & MENGGAMBAR SD */}
              {formData.jenisLomba === "MEWARNAI" && (
                <motion.div
                  key="mewarnai"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col gap-3 my-2 p-4 rounded-3xl bg-white/40 backdrop-blur-md ring ring-[#30B5D8] text-left">
                  <h3 className="font-['body-bold'] text-[#00354E] text-sm underline decoration-[#f0ac2d]">
                    Detail Khusus Lomba Mewarnai & Menggambar SD
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#00354E] p-1">
                      Pilihan Paket Lomba
                    </label>
                    <select
                      name="paketMewarnai"
                      value={formData.paketMewarnai}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]">
                      <option value="PAKET_A">
                        Paket A — Kelas 1–3 SD (Mewarnai)
                      </option>
                      <option value="PAKET_B">
                        Paket B — Kelas 4–6 SD (Mewarnai & Menggambar)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Asal Sekolah
                      </label>
                      <input
                        type="text"
                        name="asalSekolahMewarnai"
                        placeholder="Contoh: SDN 1 Ciranjang"
                        value={formData.asalSekolahMewarnai}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Kelas
                      </label>
                      <select
                        name="kelasMewarnai"
                        value={formData.kelasMewarnai}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]">
                        <option value="KELAS_1">1</option>
                        <option value="KELAS_2">2</option>
                        <option value="KELAS_3">3</option>
                        <option value="KELAS_4">4</option>
                        <option value="KELAS_5">5</option>
                        <option value="KELAS_6">6</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#00354E] p-1">
                      Usia
                    </label>
                    <input
                      type="text"
                      name="tglLahirUsiaMewarnai"
                      placeholder="Contoh: 8"
                      value={formData.tglLahirUsiaMewarnai}
                      onChange={handleChange}
                      required
                      className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        Nama Orang Tua / Wali
                      </label>
                      <input
                        type="text"
                        name="namaOrtuMewarnai"
                        placeholder="Nama Lengkap Orang Tua / Wali"
                        value={formData.namaOrtuMewarnai}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#00354E] p-1">
                        No. WhatsApp Orang Tua / Wali
                      </label>
                      <input
                        type="text"
                        name="noWaOrtuMewarnai"
                        placeholder="08xxxxxxxxxx"
                        value={formData.noWaOrtuMewarnai}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 rounded-4xl bg-white ring ring-[#30B5D8] text-sm text-[#00354E]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 font-['body-bold'] bg-[#00354E] shadow-lg w-48 h-12 text-center p-2 text-white rounded-full transition-all hover:bg-[#002538] disabled:opacity-50 cursor-pointer">
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
