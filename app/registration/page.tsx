"use client";

import Navbar from "@/app/components/global/Navbar";
import SnapProvider from "@/app/components/payment/SnapProvider";
import Footer from "@/app/components/global/Footer";
import { registrationSchema } from "@/lib/validations/register";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type JenisLomba = "FUN_RUN" | "LCC_SD" | "TALENT_SHOW" | "MEWARNAI";

interface LccAnggota {
  nama: string;
  kelas: "4" | "5" | "6";
}

interface RegistrationFormData {
  jenisLomba: JenisLomba;

  // Fun Run
  namaLengkap: string;
  jenisKelamin: "L" | "P" | "";
  kontakDarurat: string;
  emailFunRun: string;
  whatsappFunRun: string;

  // STMS
  namaPerwakilan: string;
  emailStms: string;
  whatsappStms: string;
  kelasStms: string;
  jenisBakat: string;
  jumlahAnggotaStms: number;
  namaAnggotaStms: string[];
  alatPerlengkapan: string;
  butuhMusik: "Ya" | "Tidak";

  // Cerdas Cermat
  namaSekolah: string;
  alamatSekolah: string;
  namaGuruPendamping: string;
  emailPendamping: string;
  noWaGuru: string;
  anggotaLcc: LccAnggota[];

  // Mewarnai
  namaPeserta: string;
  asalSekolahMewarnai: string;
  kelasMewarnai: string;
  usiaMewarnai: string;
  paketMewarnai: "PAKET_A" | "PAKET_B";
  namaOrtuMewarnai: string;
  noWaOrtuMewarnai: string;
  emailOrtuMewarnai: string;
}

const initialFormData: RegistrationFormData = {
  jenisLomba: "FUN_RUN",

  namaLengkap: "",
  jenisKelamin: "",
  kontakDarurat: "",
  emailFunRun: "",
  whatsappFunRun: "",

  namaPerwakilan: "",
  emailStms: "",
  whatsappStms: "",
  kelasStms: "",
  jenisBakat: "",
  jumlahAnggotaStms: 1,
  namaAnggotaStms: [],
  alatPerlengkapan: "",
  butuhMusik: "Tidak",

  namaSekolah: "",
  alamatSekolah: "",
  namaGuruPendamping: "",
  emailPendamping: "",
  noWaGuru: "",
  anggotaLcc: [
    { nama: "", kelas: "4" },
    { nama: "", kelas: "4" },
    { nama: "", kelas: "4" },
  ],

  namaPeserta: "",
  asalSekolahMewarnai: "",
  kelasMewarnai: "",
  usiaMewarnai: "",
  paketMewarnai: "PAKET_A",
  namaOrtuMewarnai: "",
  noWaOrtuMewarnai: "",
  emailOrtuMewarnai: "",
};

const inputClass =
  "w-full p-2.5 rounded-2xl font-['body-regular'] text-[#00354E] bg-white ring ring-[#30B5D8] shadow-sm";

const labelClass =
  "block w-full p-1 font-['body-medium'] text-xs font-bold text-[#00354E]";

const sectionClass =
  "w-full flex flex-col gap-4 p-4 md:p-6 rounded-3xl bg-white/60 backdrop-blur-md ring ring-[#30B5D8] text-left";

const sectionTitleClass =
  "font-['body-bold'] text-[#00354E] text-lg underline decoration-[#f0ac2d] underline-offset-4";

export default function Registration() {
  const [formData, setFormData] =
    useState<RegistrationFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

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

    setResponseMsg(null);
  };

  const handleJenisLombaChange = (jenisLomba: JenisLomba) => {
    setFormData((prev) => ({
      ...initialFormData,
      jenisLomba,
    }));

    setFieldErrors({});
    setResponseMsg(null);
  };

  const handleJumlahAnggotaStmsChange = (jumlah: number) => {
    const total = Math.max(1, Math.min(10, Math.floor(jumlah || 1)));

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

  const handleAnggotaStmsChange = (index: number, namaLengkap: string) => {
    setFormData((prev) => {
      const anggota = [...prev.namaAnggotaStms];
      anggota[index] = namaLengkap;

      return {
        ...prev,
        namaAnggotaStms: anggota,
      };
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`anggota.${index}.namaLengkap`];
      delete next[`namaAnggotaStms.${index}`];
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
        [field]: value as LccAnggota[typeof field],
      };

      return {
        ...prev,
        anggotaLcc: anggota,
      };
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[
        `anggota.${index}.${field === "nama" ? "namaLengkap" : "kelas"}`
      ];
      delete next[`anggotaLcc.${index}.${field}`];
      return next;
    });
  };

  const buildRegistrationPayload = () => {
    switch (formData.jenisLomba) {
      case "FUN_RUN":
        return {
          jenisLomba: "FUN_RUN" as const,
          namaLengkap: formData.namaLengkap.trim(),
          jenisKelamin: formData.jenisKelamin,
          kontakDarurat: formData.kontakDarurat.trim(),
          email: formData.emailFunRun.trim(),
          noWhatsapp: formData.whatsappFunRun.trim(),
        };

      case "LCC_SD":
        return {
          jenisLomba: "CERDAS_CERMAT" as const,
          namaSekolah: formData.namaSekolah.trim(),
          alamatSekolah: formData.alamatSekolah.trim(),
          namaGuruPendamping: formData.namaGuruPendamping.trim(),
          emailPendamping: formData.emailPendamping.trim(),
          whatsappPendamping: formData.noWaGuru.trim(),
          anggota: formData.anggotaLcc.map((anggota) => ({
            namaLengkap: anggota.nama.trim(),
            kelas: anggota.kelas,
          })),
        };

      case "TALENT_SHOW":
        return {
          jenisLomba: "STMS" as const,
          namaPerwakilan: formData.namaPerwakilan.trim(),
          email: formData.emailStms.trim(),
          noWhatsapp: formData.whatsappStms.trim(),
          kelas: formData.kelasStms.trim(),
          jenisBakat: formData.jenisBakat.trim(),
          jumlahAnggota: formData.jumlahAnggotaStms,
          anggota: formData.namaAnggotaStms.map((namaLengkap) => ({
            namaLengkap: namaLengkap.trim(),
          })),
          perlengkapan: formData.alatPerlengkapan.trim(),
          menggunakanMusik: formData.butuhMusik === "Ya",
        };

      case "MEWARNAI":
        return {
          jenisLomba: "MEWARNAI" as const,
          namaPeserta: formData.namaPeserta.trim(),
          asalSekolah: formData.asalSekolahMewarnai.trim(),
          kelas: Number(formData.kelasMewarnai),
          usia: Number(formData.usiaMewarnai),
          paketLomba: formData.paketMewarnai,
          namaOrangTua: formData.namaOrtuMewarnai.trim(),
          whatsappOrangTua: formData.noWaOrtuMewarnai.trim(),
          emailOrangTua: formData.emailOrtuMewarnai.trim(),
        };
    }
  };

  const mapErrorPath = (path: string, jenisLomba: JenisLomba): string => {
    const directMappings: Record<string, string> = {
      namaPerwakilan: "namaPerwakilan",
      noWhatsapp: "whatsappStms",
      kelas: jenisLomba === "TALENT_SHOW" ? "kelasStms" : "kelasMewarnai",
      jumlahAnggota: "jumlahAnggotaStms",
      perlengkapan: "alatPerlengkapan",
      menggunakanMusik: "butuhMusik",
      whatsappPendamping: "noWaGuru",
      emailPendamping: "emailPendamping",
      asalSekolah: "asalSekolahMewarnai",
      paketLomba: "paketMewarnai",
      namaOrangTua: "namaOrtuMewarnai",
      whatsappOrangTua: "noWaOrtuMewarnai",
      emailOrangTua: "emailOrtuMewarnai",
      namaPeserta: "namaPeserta",
      namaLengkap: "namaLengkap",
      jenisKelamin: "jenisKelamin",
      kontakDarurat: "kontakDarurat",
      email: "emailFunRun",
    };

    const anggotaMatch = path.match(/^anggota\.(\d+)\.(namaLengkap|kelas)$/);

    if (anggotaMatch) {
      const [, index, field] = anggotaMatch;

      if (jenisLomba === "LCC_SD") {
        return `anggotaLcc.${index}.${field === "namaLengkap" ? "nama" : "kelas"}`;
      }

      if (jenisLomba === "TALENT_SHOW") {
        return `namaAnggotaStms.${index}`;
      }
    }

    if (path === "anggota") {
      return jenisLomba === "LCC_SD" ? "anggotaLcc" : "namaAnggotaStms";
    }

    if (path === "namaSekolah") return "namaSekolah";
    if (path === "alamatSekolah") return "alamatSekolah";
    if (path === "namaGuruPendamping") return "namaGuruPendamping";
    if (path === "jenisBakat") return "jenisBakat";

    return directMappings[path] ?? path;
  };

  async function openSnapPayment(token: string) {
    if (!window.snap) {
      throw new Error("Sistem pembayaran belum siap. Silakan coba lagi.");
    }

    window.snap.pay(token, {
      onSuccess: (result) => {
        console.log("Pembayaran berhasil diproses:", result);
        alert(
          "Pembayaran berhasil diproses. Status akhir akan dikonfirmasi oleh sistem.",
        );
      },

      onPending: (result) => {
        console.log("Pembayaran menunggu:", result);
        alert("Pembayaran masih menunggu penyelesaian.");
      },

      onError: (result) => {
        console.error("Pembayaran gagal:", result);
        alert("Pembayaran gagal diproses. Silakan coba kembali.");
      },

      onClose: () => {
        console.log("Popup pembayaran ditutup.");
      },
    });
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submittingRef.current) return;

    submittingRef.current = true;

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
          const uiPath = mapErrorPath(path, formData.jenisLomba);

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
        data?: {
          id?: string;
          token?: string;
          lomba?: {
            id: string;
            orderId: string;
          };
        };
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
            errors[mapErrorPath(path, formData.jenisLomba)] ??= issue.message;
          }

          setFieldErrors(errors);
        }

        throw new Error(
          result.error ?? result.message ?? "Gagal menyimpan pendaftaran.",
        );
      }

      const token = result.data?.token;

      if (typeof token !== "string" || !token) {
        throw new Error(
          "Pendaftaran tersimpan, tetapi token pembayaran tidak ditemukan.",
        );
      }

      // Pendaftaran sudah berhasil dibuat dan token pembayaran tersedia.
      setFormData({
        ...initialFormData,
        jenisLomba: formData.jenisLomba,
      });

      setFieldErrors({});
      setResponseMsg({
        type: "success",
        text: "Pendaftaran berhasil dibuat. Silakan lanjutkan pembayaran melalui Snap.",
      });

      await openSnapPayment(token);

      await openSnapPayment(token);

      setResponseMsg({
        type: "success",
        text: result.data?.lomba?.id
          ? `Pendaftaran berhasil dibuat. ID: ${result.data.lomba.id}. Silakan selesaikan pembayaran melalui Snap.`
          : "Pendaftaran berhasil dibuat. Silakan selesaikan pembayaran melalui Snap.",
      });
    } catch (error: unknown) {
      setResponseMsg({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const renderError = (name: string) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
    ) : null;

  const renderInput = (
    label: string,
    name: keyof RegistrationFormData,
    value: string,
    placeholder: string,
    type = "text",
    required = true,
  ) => (
    <div className="w-full">
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
      {renderError(name)}
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof RegistrationFormData,
    value: string,
    options: Array<{ label: string; value: string }>,
    required = true,
  ) => (
    <div className="w-full">
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        className={`${inputClass} cursor-pointer`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {renderError(name)}
    </div>
  );

  return (
    <>
      <SnapProvider />
      <Navbar />
      <div className="min-h-screen bg-[url(/content/regist-hero.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="min-h-screen backdrop-blur-sm p-4 md:p-6 flex flex-col text-center gap-10 items-center">
          <h1 className="mt-20 font-['Telma-Bold'] text-5xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3] md:text-6xl lg:text-8xl">
            Pra-Event Registration
          </h1>

          <form
            className="flex flex-col gap-5 w-full max-w-2xl justify-center items-center mb-20 px-2"
            onSubmit={handleSubmit}>
            {responseMsg && (
              <div
                role="alert"
                className={`p-3 rounded-xl text-sm w-full ${
                  responseMsg.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-400"
                    : "bg-red-100 text-red-800 border border-red-400"
                }`}>
                {responseMsg.text}
              </div>
            )}

            {/* Hanya pilihan lomba yang ditampilkan di awal */}
            <div className="w-full text-left">
              <label className={labelClass} htmlFor="jenisLomba">
                Pilih Jenis Pra-Event
              </label>

              <select
                id="jenisLomba"
                name="jenisLomba"
                value={formData.jenisLomba}
                onChange={(e) =>
                  handleJenisLombaChange(e.target.value as JenisLomba)
                }
                className={`${inputClass} cursor-pointer`}>
                <option value="FUN_RUN">Fun Run 7K</option>
                <option value="LCC_SD">Lomba Cerdas Cermat SD</option>
                <option value="TALENT_SHOW">
                  Smancir Talent Mini Show (STMS)
                </option>
                <option value="MEWARNAI">Lomba Mewarnai & Menggambar SD</option>
              </select>
            </div>

            <AnimatePresence mode="wait">
              {/* FUN RUN */}
              {formData.jenisLomba === "FUN_RUN" && (
                <motion.section
                  key="fun-run"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={sectionClass}>
                  <h2 className={sectionTitleClass}>Data Peserta Fun Run</h2>

                  {renderInput(
                    "Nama Lengkap",
                    "namaLengkap",
                    formData.namaLengkap,
                    "Masukkan nama lengkap peserta",
                  )}

                  {renderSelect(
                    "Jenis Kelamin",
                    "jenisKelamin",
                    formData.jenisKelamin,
                    [
                      { label: "Pilih jenis kelamin", value: "" },
                      { label: "Laki-laki", value: "L" },
                      { label: "Perempuan", value: "P" },
                    ],
                  )}

                  {renderInput(
                    "Kontak Darurat",
                    "kontakDarurat",
                    formData.kontakDarurat,
                    "Nomor keluarga atau kontak darurat",
                  )}

                  {renderInput(
                    "Email",
                    "emailFunRun",
                    formData.emailFunRun,
                    "email@domain.com",
                    "email",
                  )}

                  {renderInput(
                    "Nomor WhatsApp",
                    "whatsappFunRun",
                    formData.whatsappFunRun,
                    "08xxxxxxxxxx",
                  )}
                </motion.section>
              )}

              {/* CERDAS CERMAT */}
              {formData.jenisLomba === "LCC_SD" && (
                <motion.section
                  key="cerdas-cermat"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={sectionClass}>
                  <h2 className={sectionTitleClass}>
                    Identitas Sekolah & Tim Cerdas Cermat
                  </h2>

                  {renderInput(
                    "Nama Sekolah",
                    "namaSekolah",
                    formData.namaSekolah,
                    "Contoh: SDN 1 Ciranjang",
                  )}

                  {renderInput(
                    "Alamat Sekolah",
                    "alamatSekolah",
                    formData.alamatSekolah,
                    "Alamat lengkap sekolah",
                  )}

                  {renderInput(
                    "Nama Guru Pendamping",
                    "namaGuruPendamping",
                    formData.namaGuruPendamping,
                    "Nama guru dan gelar",
                  )}

                  {renderInput(
                    "Email Guru Pendamping",
                    "emailPendamping",
                    formData.emailPendamping,
                    "guru@sekolah.sch.id",
                    "email",
                  )}

                  {renderInput(
                    "WhatsApp Guru Pendamping",
                    "noWaGuru",
                    formData.noWaGuru,
                    "08xxxxxxxxxx",
                  )}

                  <div className="w-full flex flex-col gap-3">
                    <h3 className="font-bold text-sm text-[#00354E]">
                      Data Tiga Anggota Tim
                    </h3>

                    {formData.anggotaLcc.map((anggota, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/90 rounded-2xl ring ring-[#30B5D8]/40 flex flex-col gap-2">
                        <span className="text-xs font-bold text-[#00354E]">
                          Anggota {index + 1}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={anggota.nama}
                              onChange={(e) =>
                                handleAnggotaLccChange(
                                  index,
                                  "nama",
                                  e.target.value,
                                )
                              }
                              placeholder="Nama lengkap anggota"
                              required
                              className={inputClass}
                            />
                            {renderError(`anggotaLcc.${index}.nama`)}
                          </div>

                          <div>
                            <select
                              value={anggota.kelas}
                              onChange={(e) =>
                                handleAnggotaLccChange(
                                  index,
                                  "kelas",
                                  e.target.value,
                                )
                              }
                              className={inputClass}>
                              <option value="4">Kelas 4</option>
                              <option value="5">Kelas 5</option>
                              <option value="6">Kelas 6</option>
                            </select>
                            {renderError(`anggotaLcc.${index}.kelas`)}
                          </div>
                        </div>
                      </div>
                    ))}

                    {renderError("anggotaLcc")}
                  </div>
                </motion.section>
              )}

              {/* STMS */}
              {formData.jenisLomba === "TALENT_SHOW" && (
                <motion.section
                  key="stms"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={sectionClass}>
                  <h2 className={sectionTitleClass}>Data Pendaftaran STMS</h2>

                  {renderInput(
                    "Nama Perwakilan / Peserta Utama",
                    "namaPerwakilan",
                    formData.namaPerwakilan,
                    "Nama lengkap perwakilan",
                  )}

                  {renderInput(
                    "Email Perwakilan",
                    "emailStms",
                    formData.emailStms,
                    "email@domain.com",
                    "email",
                  )}

                  {renderInput(
                    "WhatsApp Perwakilan",
                    "whatsappStms",
                    formData.whatsappStms,
                    "08xxxxxxxxxx",
                  )}

                  {renderInput(
                    "Kelas",
                    "kelasStms",
                    formData.kelasStms,
                    "Contoh: XII-F2A",
                  )}

                  {renderInput(
                    "Jenis Bakat",
                    "jenisBakat",
                    formData.jenisBakat,
                    "Contoh: Band, tari, vokal",
                  )}

                  <div>
                    <label className={labelClass} htmlFor="jumlahAnggotaStms">
                      Jumlah Total Anggota
                    </label>
                    <input
                      id="jumlahAnggotaStms"
                      type="number"
                      min={1}
                      max={10}
                      value={formData.jumlahAnggotaStms}
                      onChange={(e) =>
                        handleJumlahAnggotaStmsChange(Number(e.target.value))
                      }
                      required
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Termasuk perwakilan. Total anggota 1–10 orang.
                    </p>
                    {renderError("jumlahAnggotaStms")}
                  </div>

                  {formData.namaAnggotaStms.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold text-sm text-[#00354E]">
                        Nama Anggota Tambahan
                      </h3>

                      {formData.namaAnggotaStms.map((nama, index) => (
                        <div key={index}>
                          <label
                            className={labelClass}
                            htmlFor={`anggota-stms-${index}`}>
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
                            className={inputClass}
                          />

                          {renderError(`namaAnggotaStms.${index}`)}
                        </div>
                      ))}
                    </div>
                  )}

                  {renderSelect(
                    "Apakah Membutuhkan Musik Pengiring?",
                    "butuhMusik",
                    formData.butuhMusik,
                    [
                      { label: "Tidak membutuhkan", value: "Tidak" },
                      { label: "Ya, membutuhkan", value: "Ya" },
                    ],
                  )}

                  <div>
                    <label className={labelClass} htmlFor="alatPerlengkapan">
                      Alat / Perlengkapan yang Dibutuhkan
                    </label>
                    <textarea
                      id="alatPerlengkapan"
                      name="alatPerlengkapan"
                      rows={3}
                      value={formData.alatPerlengkapan}
                      onChange={handleChange}
                      placeholder="Contoh: 2 stand mic, kabel jack gitar"
                      className={inputClass}
                    />
                    {renderError("alatPerlengkapan")}
                  </div>
                </motion.section>
              )}

              {/* MEWARNAI */}
              {formData.jenisLomba === "MEWARNAI" && (
                <motion.section
                  key="mewarnai"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={sectionClass}>
                  <h2 className={sectionTitleClass}>
                    Data Peserta Mewarnai & Menggambar
                  </h2>

                  {renderInput(
                    "Nama Lengkap Anak",
                    "namaPeserta",
                    formData.namaPeserta,
                    "Nama lengkap peserta",
                  )}

                  {renderInput(
                    "Asal Sekolah",
                    "asalSekolahMewarnai",
                    formData.asalSekolahMewarnai,
                    "Contoh: SDN 1 Ciranjang",
                  )}

                  {renderSelect(
                    "Paket Lomba",
                    "paketMewarnai",
                    formData.paketMewarnai,
                    [
                      {
                        label: "Paket A — Kelas 1–3 SD (Mewarnai)",
                        value: "PAKET_A",
                      },
                      {
                        label: "Paket B — Kelas 4–6 SD (Mewarnai & Menggambar)",
                        value: "PAKET_B",
                      },
                    ],
                  )}

                  {renderSelect(
                    "Kelas",
                    "kelasMewarnai",
                    formData.kelasMewarnai,
                    [
                      { label: "Pilih kelas", value: "" },
                      { label: "Kelas 1", value: "1" },
                      { label: "Kelas 2", value: "2" },
                      { label: "Kelas 3", value: "3" },
                      { label: "Kelas 4", value: "4" },
                      { label: "Kelas 5", value: "5" },
                      { label: "Kelas 6", value: "6" },
                    ],
                  )}

                  {renderInput(
                    "Usia Anak",
                    "usiaMewarnai",
                    formData.usiaMewarnai,
                    "Contoh: 8",
                    "number",
                  )}

                  <p className="text-xs text-gray-600 -mt-2">
                    Masukkan usia dalam tahun, misalnya 8.
                  </p>

                  <div className="border-t border-[#30B5D8]/50 pt-4 flex flex-col gap-4">
                    <h3 className="font-bold text-sm text-[#00354E]">
                      Data Orang Tua / Wali
                    </h3>

                    {renderInput(
                      "Nama Orang Tua / Wali",
                      "namaOrtuMewarnai",
                      formData.namaOrtuMewarnai,
                      "Nama lengkap orang tua/wali",
                    )}

                    {renderInput(
                      "WhatsApp Orang Tua / Wali",
                      "noWaOrtuMewarnai",
                      formData.noWaOrtuMewarnai,
                      "08xxxxxxxxxx",
                    )}

                    {renderInput(
                      "Email Orang Tua / Wali",
                      "emailOrtuMewarnai",
                      formData.emailOrtuMewarnai,
                      "orangtua@domain.com",
                      "email",
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 font-['body-bold'] bg-[#00354E] shadow-lg w-48 min-h-12 text-center p-3 text-white rounded-full transition-all hover:bg-[#002538] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
