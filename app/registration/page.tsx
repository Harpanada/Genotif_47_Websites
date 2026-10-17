"use client";
import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import GlobalHero from "@/app/components/global/GlobalHero";
import { useState } from "react";
export default function Registration() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    noWhatsapp: "",
    asalSekolah: "",
    jenisLomba: "Band", // Default pilihan
    namaTim: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Terjadi kesalahan saat mendaftar");
      }

      setResponseMsg({
        type: "success",
        text: "Registrasi berhasil! Data pendaftaran kamu sudah tersimpan.",
      });

      // Reset form jika perlu
      setFormData({
        namaLengkap: "",
        email: "",
        noWhatsapp: "",
        asalSekolah: "",
        jenisLomba: "Band",
        namaTim: "",
      });
    } catch (err: any) {
      setResponseMsg({
        type: "error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen brightness-95  bg-[url(/content/regist-hero.jpg)] bg-cover bg-center  min-w-screen   bg-no-repeat  z-0 bg-fixed">
        {" "}
        <div className="min-h-screen  backdrop-blur-sm  p-6 flex flex-col text-center gap-14 items-center ">
          <h1 className="mt-20 font-['Telma-Bold'] text-5xl  text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]  md:text-6xl lg:text-8xl   ">
            Pra-Event Registration
          </h1>
          <form
            className="flex flex-col gap-2 w-4/5 justify-center items-center mb-20 "
            onSubmit={handleSubmit}
          >
            {/* Notifikasi feedback */}
            {responseMsg && (
              <div
                className={`p-3 rounded text-sm ${
                  responseMsg.type === "success"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {responseMsg.text}
              </div>
            )}
            <div className="text-left flex flex-col w-full ">
              <label className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
              />
            </div>
            <div className="text-left  flex flex-col    w-full ">
              <label className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
              />
            </div>
            <div className="text-left  flex flex-col   w-full">
              <label className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold">
                No Whatsapp
              </label>
              <input
                type="text"
                name="noWhatsapp"
                value={formData.noWhatsapp}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
              />
            </div>
            <div className="text-left  flex flex-col  w-full">
              <label className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold">
                Asal Sekolah
              </label>
              <input
                type="text"
                name="asalSekolah"
                value={formData.asalSekolah}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
              />
            </div>
            <div className="text-left flex flex-col w-full">
              <label className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold ">
                Pilih Lomba
              </label>
              <select
                name="jenisLomba"
                value={formData.jenisLomba}
                onChange={handleChange}
                className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg"
              >
                <option value="FUN_RUN">Fun Run 7K</option>
                <option value="MEWARNAI">Lomba Mewarnai</option>
                <option value="TALENT_SHOW">Smancir Talent Mini Show</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 font-['body-bold'] bg-[#00354E] shadow-lg w-44 h-12  text-center p-2 text-white rounded-full "
            >
              {loading ? "Mengirim Data..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
