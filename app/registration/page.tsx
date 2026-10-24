"use client";

import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import { registrationSchema } from "@/lib/validations/register";
import { useState } from "react";

type EventType = "FUN_RUN" | "CERDAS_CERMAT" | "STMS" | "MEWARNAI";
type Member = { namaLengkap: string; kelas: "4" | "5" | "6" };

const inputClass = "w-full rounded-xl border border-[#30B5D8] bg-white p-3 text-[#00354E] outline-none focus:ring-2 focus:ring-[#30B5D8]";
const labelClass = "mb-1 block text-sm font-semibold text-[#00354E]";

export default function Registration() {
  const [jenisLomba, setJenisLomba] = useState<EventType>("FUN_RUN");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type:"success"|"error"; text:string}|null>(null);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [funRun, setFunRun] = useState({namaLengkap:"",jenisKelamin:"L" as "L"|"P",kontakDarurat:"",email:"",noWhatsapp:""});
  const [lcc, setLcc] = useState({namaSekolah:"",alamatSekolah:"",namaGuruPendamping:"",emailPendamping:"",whatsappPendamping:"",anggota:[{namaLengkap:"",kelas:"4" as "4"|"5"|"6"},{namaLengkap:"",kelas:"4" as "4"|"5"|"6"},{namaLengkap:"",kelas:"4" as "4"|"5"|"6"}]});
  const [stms, setStms] = useState({namaPerwakilan:"",kelas:"",jenisBakat:"",jumlahAnggota:1,anggota:[] as {namaLengkap:string}[],menggunakanMusik:false,perlengkapan:""});
  const [mewarnai, setMewarnai] = useState({namaPeserta:"",asalSekolah:"",kelas:"1",usia:"",namaOrangTua:"",whatsappOrangTua:"",emailOrangTua:"",paketLomba:"PAKET_A" as "PAKET_A"|"PAKET_B"});

  const changeEvent = (value: EventType) => { setJenisLomba(value); setErrors({}); setMessage(null); };
  const updateSTMSCount = (value: number) => {
    const count = Math.max(1, Math.min(10, Math.floor(value || 1)));
    setStms(prev => ({...prev, jumlahAnggota:count, anggota:Array.from({length:count-1},(_,i)=>prev.anggota[i] ?? {namaLengkap:""})}));
    setErrors({});
  };
  const buildPayload = () => {
    switch (jenisLomba) {
      case "FUN_RUN": return {...funRun, jenisLomba};
      case "CERDAS_CERMAT": return {...lcc, jenisLomba};
      case "STMS": return {...stms, jenisLomba};
      case "MEWARNAI": return {...mewarnai, usia:Number(mewarnai.usia), jenisLomba};
    }
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setErrors({}); setMessage(null);
    try {
      const parsed = registrationSchema.safeParse(buildPayload());
      if (!parsed.success) {
        const next:Record<string,string> = {};
        parsed.error.issues.forEach(issue => { next[issue.path.map(String).join(".")] ??= issue.message; });
        setErrors(next); setMessage({type:"error",text:"Periksa kembali data yang ditandai."}); return;
      }
      const response = await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(parsed.data)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Pendaftaran gagal disimpan.");
      setMessage({type:"success",text:`Pendaftaran berhasil! ID: ${result.data?.id ?? "tersimpan"}`});
    } catch (error) {
      setMessage({type:"error",text:error instanceof Error ? error.message : "Terjadi kesalahan."});
    } finally { setLoading(false); }
  };
  const field = (label:string,name:string,value:string,onChange:(value:string)=>void,type="text",placeholder="") => (
    <div><label className={labelClass} htmlFor={name}>{label}</label><input className={inputClass} id={name} name={name} type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />{errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}</div>
  );

  return <>
    <Navbar />
    <main className="min-h-screen bg-[url(/content/regist-hero.jpg)] bg-cover bg-center bg-fixed px-4 py-16">
      <div className="mx-auto mt-8 w-full max-w-3xl rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur md:p-10">
        <h1 className="mb-2 text-center font-['Telma-Bold'] text-4xl text-[#00354E] md:text-6xl">Pra-Event Registration</h1>
        <p className="mb-8 text-center text-sm text-[#00354E]">Pilih jenis pra-event, lalu isi formulir sesuai lomba.</p>
        {message && <div role="status" className={`mb-5 rounded-xl border p-3 ${message.type==="success"?"border-green-500 bg-green-50 text-green-800":"border-red-500 bg-red-50 text-red-800"}`}>{message.text}</div>}
        <form onSubmit={submit} className="space-y-5">
          <div><label className={labelClass} htmlFor="jenisLomba">Pilih Jenis Pra-Event</label><select id="jenisLomba" className={inputClass} value={jenisLomba} onChange={e=>changeEvent(e.target.value as EventType)}><option value="FUN_RUN">Fun Run 7K</option><option value="CERDAS_CERMAT">Lomba Cerdas Cermat SD</option><option value="STMS">Smancir Talent Mini Show</option><option value="MEWARNAI">Lomba Mewarnai dan Menggambar SD</option></select></div>
          {jenisLomba==="FUN_RUN" && <section className="space-y-4 rounded-2xl border border-[#30B5D8] bg-[#EAF9FC] p-4"><h2 className="text-lg font-bold text-[#00354E]">Data Peserta Fun Run</h2>
            {field("Nama Lengkap","namaLengkap",funRun.namaLengkap,v=>setFunRun(p=>({...p,namaLengkap:v})))}
            <div><label className={labelClass} htmlFor="jenisKelamin">Jenis Kelamin</label><select id="jenisKelamin" className={inputClass} value={funRun.jenisKelamin} onChange={e=>setFunRun(p=>({...p,jenisKelamin:e.target.value as "L"|"P"}))}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>{errors.jenisKelamin && <p className="text-sm text-red-600">{errors.jenisKelamin}</p>}</div>
            {field("Kontak Darurat","kontakDarurat",funRun.kontakDarurat,v=>setFunRun(p=>({...p,kontakDarurat:v})),"tel")}
            {field("Email","email",funRun.email,v=>setFunRun(p=>({...p,email:v})),"email")}
            {field("WhatsApp","noWhatsapp",funRun.noWhatsapp,v=>setFunRun(p=>({...p,noWhatsapp:v})),"tel")}
          </section>}
          {jenisLomba==="CERDAS_CERMAT" && <section className="space-y-4 rounded-2xl border border-[#30B5D8] bg-[#EAF9FC] p-4"><h2 className="text-lg font-bold text-[#00354E]">Data Cerdas Cermat SD</h2>
            {field("Nama Sekolah","namaSekolah",lcc.namaSekolah,v=>setLcc(p=>({...p,namaSekolah:v})))}
            {field("Alamat Sekolah","alamatSekolah",lcc.alamatSekolah,v=>setLcc(p=>({...p,alamatSekolah:v})))}
            {field("Nama Guru Pendamping","namaGuruPendamping",lcc.namaGuruPendamping,v=>setLcc(p=>({...p,namaGuruPendamping:v})))}
            {field("Email Guru Pendamping","emailPendamping",lcc.emailPendamping,v=>setLcc(p=>({...p,emailPendamping:v})),"email")}
            {field("WhatsApp Guru Pendamping","whatsappPendamping",lcc.whatsappPendamping,v=>setLcc(p=>({...p,whatsappPendamping:v})),"tel")}
            <h3 className="font-semibold text-[#00354E]">3 Anggota / Peserta</h3>
            {lcc.anggota.map((member,index)=><div key={index} className="space-y-2 rounded-xl border border-white bg-white/80 p-3"><p className="font-semibold">Peserta {index+1}</p>{field("Nama Peserta",`anggota.${index}.namaLengkap`,member.namaLengkap,v=>setLcc(p=>({...p,anggota:p.anggota.map((m,i)=>i===index?{...m,namaLengkap:v}:m)})))}<div><label className={labelClass} htmlFor={`kelas-${index}`}>Kelas</label><select id={`kelas-${index}`} className={inputClass} value={member.kelas} onChange={e=>setLcc(p=>({...p,anggota:p.anggota.map((m,i)=>i===index?{...m,kelas:e.target.value as Member["kelas"]}:m)}))}><option value="4">Kelas 4</option><option value="5">Kelas 5</option><option value="6">Kelas 6</option></select>{errors[`anggota.${index}.kelas`] && <p className="text-sm text-red-600">{errors[`anggota.${index}.kelas`]}</p>}</div></div>)}
          </section>}
          {jenisLomba==="STMS" && <section className="space-y-4 rounded-2xl border border-[#30B5D8] bg-[#EAF9FC] p-4"><h2 className="text-lg font-bold text-[#00354E]">Smancir Talent Mini Show</h2>
            {field("Nama Peserta / Perwakilan","namaPerwakilan",stms.namaPerwakilan,v=>setStms(p=>({...p,namaPerwakilan:v})))}
            {field("Kelas Peserta","kelas",stms.kelas,v=>setStms(p=>({...p,kelas:v})))}
            {field("Jenis Bakat","jenisBakat",stms.jenisBakat,v=>setStms(p=>({...p,jenisBakat:v})))}
            <div><label className={labelClass} htmlFor="jumlahAnggota">Jumlah Anggota (1–10, termasuk perwakilan)</label><input id="jumlahAnggota" className={inputClass} type="number" min={1} max={10} value={stms.jumlahAnggota} onChange={e=>updateSTMSCount(Number(e.target.value))}/>{errors.jumlahAnggota && <p className="text-sm text-red-600">{errors.jumlahAnggota}</p>}</div>
            {stms.anggota.map((member,index)=><div key={index}>{field(`Nama Anggota ${index+2}`,`anggota.${index}.namaLengkap`,member.namaLengkap,v=>setStms(p=>({...p,anggota:p.anggota.map((m,i)=>i===index?{namaLengkap:v}:m)})))}</div>)}
            <div><label className={labelClass} htmlFor="menggunakanMusik">Musik Pengiring</label><select id="menggunakanMusik" className={inputClass} value={String(stms.menggunakanMusik)} onChange={e=>setStms(p=>({...p,menggunakanMusik:e.target.value==="true"}))}><option value="true">Ya</option><option value="false">Tidak</option></select></div>
            <div><label className={labelClass} htmlFor="perlengkapan">Alat / Perlengkapan yang Dibutuhkan</label><textarea id="perlengkapan" className={inputClass} rows={3} value={stms.perlengkapan} onChange={e=>setStms(p=>({...p,perlengkapan:e.target.value}))}/>{errors.perlengkapan && <p className="text-sm text-red-600">{errors.perlengkapan}</p>}</div>
          </section>}
          {jenisLomba==="MEWARNAI" && <section className="space-y-4 rounded-2xl border border-[#30B5D8] bg-[#EAF9FC] p-4"><h2 className="text-lg font-bold text-[#00354E]">Mewarnai dan Menggambar SD</h2>
            {field("Nama Peserta (Anak)","namaPeserta",mewarnai.namaPeserta,v=>setMewarnai(p=>({...p,namaPeserta:v})))}
            {field("Asal Sekolah","asalSekolah",mewarnai.asalSekolah,v=>setMewarnai(p=>({...p,asalSekolah:v})))}
            <div><label className={labelClass} htmlFor="kelasMewarnai">Kelas</label><select id="kelasMewarnai" className={inputClass} value={mewarnai.kelas} onChange={e=>setMewarnai(p=>({...p,kelas:e.target.value}))}><option value="1">Kelas 1</option><option value="2">Kelas 2</option><option value="3">Kelas 3</option><option value="4">Kelas 4</option><option value="5">Kelas 5</option><option value="6">Kelas 6</option></select>{errors.kelas && <p className="text-sm text-red-600">{errors.kelas}</p>}</div>
            {field("Usia (tahun)","usia",mewarnai.usia,v=>setMewarnai(p=>({...p,usia:v})),"number")}
            {field("Nama Orang Tua / Wali","namaOrangTua",mewarnai.namaOrangTua,v=>setMewarnai(p=>({...p,namaOrangTua:v})))}
            {field("WhatsApp Orang Tua / Wali","whatsappOrangTua",mewarnai.whatsappOrangTua,v=>setMewarnai(p=>({...p,whatsappOrangTua:v})),"tel")}
            {field("Email Orang Tua / Wali","emailOrangTua",mewarnai.emailOrangTua,v=>setMewarnai(p=>({...p,emailOrangTua:v})),"email")}
            <div><label className={labelClass} htmlFor="paketLomba">Paket Lomba</label><select id="paketLomba" className={inputClass} value={mewarnai.paketLomba} onChange={e=>setMewarnai(p=>({...p,paketLomba:e.target.value as "PAKET_A"|"PAKET_B"}))}><option value="PAKET_A">Paket A — Kelas 1–3 SD</option><option value="PAKET_B">Paket B — Kelas 4–6 SD</option></select>{errors.paketLomba && <p className="text-sm text-red-600">{errors.paketLomba}</p>}</div>
          </section>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#00354E] px-5 py-3 font-bold text-white transition hover:bg-[#005070] disabled:opacity-60">{loading?"Menyimpan...":"Daftar Sekarang"}</button>
        </form>
      </div>
    </main>
    <Footer />
  </>;
}
