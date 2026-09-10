import Card from "@/app/components/main/news/Card";
export default function News() {
  return (
    <section className="mt-10  w-full min-h-screen flex flex-col items-center text-center gap-6">
      <hr className="w-2/3 text-[#00354E]" />
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg">
        Latest News
      </h1>
      <div className="grid grid-cols-1 gap-6">
        <Card
          cardTitle="CFD BOOTH"
          cardSubtitle="Panitia Genotif 47 menjual berbagai macam snack yang enak dan kekinian. Kunjung booth Genotif 47 di Car Free Day Hawurwangi setiap hari Minggu "
          cardImg="/content/scene-fair.jpg"
        />

        <Card
          cardTitle="PANITIA G47"
          cardSubtitle="Panitia Genotif 47 menjual berbagai macam snack yang enak dan kekinian. Kunjung booth Genotif 47 di Car Free Day Hawurwangi setiap hari Minggu "
          cardImg="/content/scene-fair.jpg"
        />
      </div>
    </section>
  );
}
