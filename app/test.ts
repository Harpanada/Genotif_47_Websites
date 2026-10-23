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

// const model = db.orm.public.Peserta as any;

// const tests: [string, () => Promise<unknown>][] = [
//   [
//     "where().first()",
//     () => model.where({ email: "harpanadal@gmail.com" }).first(),
//   ],

//   ["where().limit(2)", () => model.where({}).limit(2)],

//   ["where().all()", () => model.where({}).all()],

//   ["where().many()", () => model.where({}).many()],

//   ["findMany()", () => model.findMany()],

//   ["all()", () => model.all()],

//   ["limit(2)", () => model.limit(2)],
// ];

// async function main() {
//   for (const [name, run] of tests) {
//     try {
//       const result = await run();

//       console.log(`\n✅ ${name}`);
//       console.dir(result, { depth: 2 });
//     } catch (error) {
//       console.log(`\n❌ ${name}`);
//       console.log(error instanceof Error ? error.message : error);
//     }
//   }
// }

// main().catch(console.error);

// const model = db.orm.public.Peserta as any;

// const tests: [string, () => Promise<unknown>][] = [
//   ["where({}).limit(2).all()", () => model.where({}).limit(2).all()],
//   [
//     "where({}).orderBy(...).all()",
//     () => model.where({}).orderBy({ namaLengkap: "asc" }).all(),
//   ],
//   [
//     "where({}).include({ lomba: true }).all()",
//     () => model.where({}).include({ lomba: true }).all(),
//   ],
// ];

// async function main() {
//   for (const [name, run] of tests) {
//     try {
//       console.log(`\n🧪 ${name}`);
//       console.dir(await run(), { depth: 4 });
//     } catch (error) {
//       console.log(`❌ ${name}`);
//       console.log(error instanceof Error ? error.message : error);
//     }
//   }
// }

// main().catch(console.error);

// const model = db.orm.public.Peserta as any;

// const tests: [string, () => Promise<unknown>][] = [
//   [
//     "orderBy callback",
//     () =>
//       model
//         .where({})
//         .orderBy((fields: any) => fields.namaLengkap.asc())
//         .all(),
//   ],
//   ["orderBy string", () => model.where({}).orderBy("namaLengkap").all()],
//   ["include string", () => model.where({}).include("lomba").all()],
//   ["include array", () => model.where({}).include(["lomba"]).all()],
// ];

// async function main() {
//   for (const [name, run] of tests) {
//     try {
//       console.log(`\n🧪 ${name}`);
//       console.dir(await run(), { depth: 4 });
//     } catch (error) {
//       console.log(`❌ ${name}`);
//       console.log(error instanceof Error ? error.message : error);
//     }
//   }
// }

// main().catch(console.error);

// const model = db.orm.public.DataLomba as any;

// const tests: [string, () => Promise<unknown>][] = [
//   [
//     "DataLomba + detailMewarnai",
//     () => model.where({}).include("detailMewarnai").all(),
//   ],
//   ["DataLomba + detailSTMS", () => model.where({}).include("detailSTMS").all()],
//   [
//     "DataLomba + detailCerdasCermat",
//     () => model.where({}).include("detailCerdasCermat").all(),
//   ],
// ];

// async function main() {
//   for (const [name, run] of tests) {
//     try {
//       console.log(`\n🧪 ${name}`);
//       console.dir(await run(), { depth: 5 });
//     } catch (error) {
//       console.log(`❌ ${name}`);
//       console.log(error instanceof Error ? error.message : error);
//     }
//   }
// }

// main().catch(console.error);

// const model = db.orm.public.DataLomba as any;
// const tests: [string, () => Promise<unknown>][] = [
//   ["DataLomba + peserta", () => model.where({}).include("peserta").all()],
//   [
//     "DataLomba + detailSTMS.anggota",
//     () => model.where({}).include("detailSTMS.anggota").all(),
//   ],
//   [
//     "DataLomba + detailCerdasCermat.anggota",
//     () => model.where({}).include("detailCerdasCermat.anggota").all(),
//   ],
// ];

// async function main() {
//   for (const [name, run] of tests) {
//     try {
//       console.log(`\n🧪 ${name}`);
//       console.dir(await run(), { depth: 6 });
//     } catch (error) {
//       console.log(`❌ ${name}`);
//       console.log(error instanceof Error ? error.message : error);
//     }
//   }
// }

// main().catch(console.error);

const tests: [string, () => Promise<unknown>][] = [
  [
    "DetailSTMS + anggota",
    () => (db.orm.public.DetailSTMS as any).where({}).include("anggota").all(),
  ],
  [
    "DetailCerdasCermat + anggota",
    () =>
      (db.orm.public.DetailCerdasCermat as any)
        .where({})
        .include("anggota")
        .all(),
  ],
  [
    "DataLomba + peserta + detailSTMS",
    () =>
      (db.orm.public.DataLomba as any)
        .where({})
        .include("peserta")
        .include("detailSTMS")
        .all(),
  ],
];

async function main() {
  for (const [name, run] of tests) {
    try {
      console.log(`\n🧪 ${name}`);
      console.dir(await run(), { depth: 6 });
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(error instanceof Error ? error.message : error);
    }
  }
}

main().catch(console.error);
