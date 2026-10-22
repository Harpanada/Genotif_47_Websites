import { db } from "@/src/prisma/db";
// async function main() {
//   const peserta = await db.orm.public.Peserta.where({
//     id: "de71e906-07e2-4d6e-ba5a-e99f1582eb7b",
//   }).first();

//   console.dir(peserta, { depth: null });
// }

// main().catch((error) => {
//   console.error("Test gagal:", error);
//   process.exitCode = 1;
// });

// async function main() {
//   const peserta = await db.orm.public.Peserta.where({
//     email: "harpanadal@gmail.com",
//   }).first();

//   if (!peserta) {
//     console.log("Peserta tidak ditemukan");
//     return;
//   }

//   const lomba = await db.orm.public.DataLomba.where({
//     pesertaId: peserta.id,
//   }).first();

//   if (!lomba) {
//     console.log("Data lomba tidak ditemukan");
//     return;
//   }

//   let detail = null;

//   switch (lomba.jenisLomba) {
//     case "MEWARNAI":
//       detail = await db.orm.public.DetailMewarnai.where({
//         dataLombaId: lomba.id,
//       }).first();
//       break;

//     case "TALENT_SHOW":
//       detail = await db.orm.public.DetailSTMS.where({
//         dataLombaId: lomba.id,
//       }).first();
//       break;

//     case "LCC_SD":
//       detail = await db.orm.public.DetailCerdasCermat.where({
//         dataLombaId: lomba.id,
//       }).first();
//       break;
//   }

//   console.dir({ peserta, lomba, detail }, { depth: null });
// }

// main().catch(console.error);

const model = db.orm.public.Peserta as any;

const tests: [string, () => Promise<unknown>][] = [
  [
    "where().first()",
    () => model.where({ email: "harpanadal@gmail.com" }).first(),
  ],

  ["where().limit(2)", () => model.where({}).limit(2)],

  ["where().all()", () => model.where({}).all()],

  ["where().many()", () => model.where({}).many()],

  ["findMany()", () => model.findMany()],

  ["all()", () => model.all()],

  ["limit(2)", () => model.limit(2)],
];

async function main() {
  for (const [name, run] of tests) {
    try {
      const result = await run();

      console.log(`\n✅ ${name}`);
      console.dir(result, { depth: 2 });
    } catch (error) {
      console.log(`\n❌ ${name}`);
      console.log(error instanceof Error ? error.message : error);
    }
  }
}

main().catch(console.error);
