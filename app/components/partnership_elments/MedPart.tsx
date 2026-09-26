import CardTwo from "./Card_2";

export default function MedPart() {
  return (
    <section className="flex flex-col md:flex-row gap-6 justify-center items-center">
      <CardTwo
        cardTtl="Town Crier"
        cardLink="/"
        give="3 feed posts + 5 stories"
        recieve="Logo on digital flyer, 1 press pass"
        platfrom="Social Media"
      />
      <CardTwo
        cardTtl="Royal Scribe"
        cardLink="/"
        give="1 pre-event article + 1 recaps"
        recieve="Logo on website, 2 press passes, interview slot "
        platfrom="Blog / Online Magazine"
      />
      <CardTwo
        cardTtl="Kingdom Herald"
        cardLink="/"
        give="On-air mentions + event coverage"
        recieve="Title media partner credit, stage logo, 4 press passes"
        platfrom="Youtube Live / Podcast / Video"
      />
    </section>
  );
}
